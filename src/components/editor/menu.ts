import { Schema } from 'prosemirror-model'
import { MenuItem, menuBar, Dropdown } from 'prosemirror-menu'
import {
  toggleMark,
  setBlockType,
  chainCommands,
  wrapIn,
  lift,
  selectParentNode,
  joinUp,
  joinDown,
  deleteSelection,
  selectAll
} from 'prosemirror-commands'
import { wrapInList, splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list'
import { undo, redo } from 'prosemirror-history'

// Função utilitária para verificar se um comando pode ser executado
function canExecute(state: any, cmd: any) {
  return cmd(state)
}

// Função para criar item de menu
function cmdItem(cmd: any, options: any) {
  let passedOptions: any = {
    label: options.title,
    run: cmd
  }
  
  for (let prop in options) passedOptions[prop] = options[prop]
  
  if ((!options.enable || options.enable === true) && !options.select)
    passedOptions[options.enable ? 'enable' : 'select'] = (state: any) => cmd(state)

  return new MenuItem(passedOptions)
}

// Função para criar separador
function markActive(state: any, type: any) {
  let {from, $from, to, empty} = state.selection
  if (empty) return type.isInSet(state.storedMarks || $from.marks())
  else return state.doc.rangeHasMark(from, to, type)
}

function blockActive(state: any, type: any, attrs?: any) {
  let {$from, to, node} = state.selection
  if (node) return node.hasMarkup(type, attrs)
  return to <= $from.end() && $from.parent.hasMarkup(type, attrs)
}

export function buildMenuItems(schema: Schema) {
  let r: any = {}
  let mark = (markType: any, options: any) => {
    return cmdItem(toggleMark(markType), {
      title: options.title,
      icon: options.icon,
      active(state: any) { return markActive(state, markType) }
    })
  }

  // Itens básicos de formatação
  if (schema.marks.strong)
    r.toggleStrong = mark(schema.marks.strong, {title: "Negrito", icon: "B"})
  
  if (schema.marks.em)
    r.toggleEm = mark(schema.marks.em, {title: "Itálico", icon: "I"})
  
  if (schema.marks.code)
    r.toggleCode = mark(schema.marks.code, {title: "Código", icon: "<>"})

  // Links
  if (schema.marks.link) {
    r.toggleLink = new MenuItem({
      title: "Adicionar/remover link",
      active(state: any) { return markActive(state, schema.marks.link) },
      enable(state: any) { return !state.selection.empty },
      run(state: any, dispatch: any, view: any) {
        if (markActive(state, schema.marks.link)) {
          toggleMark(schema.marks.link)(state, dispatch)
          return true
        }
        let href = prompt("URL do link:", "")
        if (href) {
          toggleMark(schema.marks.link, {href})(state, dispatch)
          view.focus()
        }
        return true
      }
    })
  }

  // Cabeçalhos
  for (let i = 1; i <= 6; i++) {
    r["makeHead" + i] = cmdItem(setBlockType(schema.nodes.heading, {level: i}), {
      title: "Mudar para título nível " + i,
      label: "H" + i,
      active(state: any) { return blockActive(state, schema.nodes.heading, {level: i}) }
    })
  }

  // Parágrafos
  if (schema.nodes.paragraph)
    r.makeParagraph = cmdItem(setBlockType(schema.nodes.paragraph), {
      title: "Mudar para parágrafo",
      label: "P",
      active(state: any) { return blockActive(state, schema.nodes.paragraph) }
    })

  // Citações
  if (schema.nodes.blockquote)
    r.wrapBlockQuote = cmdItem(wrapIn(schema.nodes.blockquote), {
      title: "Wrap in block quote",
      icon: "❝"
    })

  // Listas
  if (schema.nodes.bullet_list)
    r.wrapBulletList = cmdItem(wrapInList(schema.nodes.bullet_list), {
      title: "Lista com marcadores",
      icon: "•"
    })
  
  if (schema.nodes.ordered_list)
    r.wrapOrderedList = cmdItem(wrapInList(schema.nodes.ordered_list), {
      title: "Lista numerada", 
      icon: "1."
    })

  // Items específicos para documentos legislativos
  if (schema.nodes.article_section) {
    r.insertArticle = new MenuItem({
      title: "Inserir Artigo",
      label: "Art.",
      run(state: any, dispatch: any) {
        let {$head} = state.selection
        let article = schema.nodes.article_section.create({}, [
          schema.nodes.article_title.create({}, schema.text("Art. [NÚMERO]º")),
          schema.nodes.caput.create({}, schema.text("[CAPUT DO ARTIGO]"))
        ])
        let tr = state.tr.replaceSelectionWith(article)
        dispatch(tr)
      }
    })
  }

  if (schema.nodes.inciso) {
    r.insertInciso = new MenuItem({
      title: "Inserir Inciso",
      label: "I -",
      run(state: any, dispatch: any) {
        let inciso = schema.nodes.inciso.create({}, [
          schema.nodes.inciso_number.create({}, schema.text("I -")),
          schema.nodes.inciso_text.create({}, schema.text("[TEXTO DO INCISO]"))
        ])
        let tr = state.tr.replaceSelectionWith(inciso)
        dispatch(tr)
      }
    })
  }

  if (schema.nodes.alinea) {
    r.insertAlinea = new MenuItem({
      title: "Inserir Alínea",
      label: "a)",
      run(state: any, dispatch: any) {
        let alinea = schema.nodes.alinea.create({}, [
          schema.nodes.alinea_letter.create({}, schema.text("a)")),
          schema.nodes.alinea_text.create({}, schema.text("[TEXTO DA ALÍNEA]"))
        ])
        let tr = state.tr.replaceSelectionWith(alinea)
        dispatch(tr)
      }
    })
  }

  if (schema.nodes.signature_block) {
    r.insertSignature = new MenuItem({
      title: "Inserir Bloco de Assinatura",
      label: "Ass.",
      run(state: any, dispatch: any) {
        let signature = schema.nodes.signature_block.create({}, [
          schema.nodes.signature_line.create({}, schema.text("_".repeat(50))),
          schema.nodes.signature_name.create({}, schema.text("[NOME]")),
          schema.nodes.signature_title.create({}, schema.text("[CARGO]"))
        ])
        let tr = state.tr.replaceSelectionWith(signature)
        dispatch(tr)
      }
    })
  }

  // Comandos de edição
  r.undo = cmdItem(undo, {title: "Desfazer", icon: "↶"})
  r.redo = cmdItem(redo, {title: "Refazer", icon: "↷"})

  // Comandos de seleção
  r.selectParentNode = cmdItem(selectParentNode, {title: "Selecionar nó pai", icon: "⬆"})

  // Comandos de lista
  if (schema.nodes.list_item) {
    r.splitListItem = cmdItem(splitListItem(schema.nodes.list_item), {
      title: "Dividir item da lista",
      icon: "⏎"
    })
    r.liftListItem = cmdItem(liftListItem(schema.nodes.list_item), {
      title: "Elevar item da lista",
      icon: "⬅"
    })
    r.sinkListItem = cmdItem(sinkListItem(schema.nodes.list_item), {
      title: "Baixar item da lista", 
      icon: "➡"
    })
  }

  // Menu principal
  r.fullMenu = [
    [r.undo, r.redo],
    [r.toggleStrong, r.toggleEm, r.toggleCode],
    [r.toggleLink],
    [r.makeParagraph, r.makeHead1, r.makeHead2, r.makeHead3],
    [r.wrapBulletList, r.wrapOrderedList],
    [r.wrapBlockQuote],
    [r.insertArticle, r.insertInciso, r.insertAlinea, r.insertSignature]
  ].filter(group => group.some(item => item))

  // Menu para formatação de texto
  r.inlineMenu = [
    [r.toggleStrong, r.toggleEm, r.toggleCode, r.toggleLink]
  ].filter(group => group.some(item => item))

  // Menu para blocos
  r.blockMenu = [
    [r.makeParagraph, r.makeHead1, r.makeHead2, r.makeHead3],
    [r.wrapBulletList, r.wrapOrderedList, r.wrapBlockQuote]
  ].filter(group => group.some(item => item))

  // Menu para elementos legislativos
  r.legislativeMenu = [
    [r.insertArticle, r.insertInciso, r.insertAlinea, r.insertSignature]
  ].filter(group => group.some(item => item))

  return r
} 