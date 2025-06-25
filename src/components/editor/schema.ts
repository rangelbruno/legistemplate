import { Schema } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

export function createDocumentSchema(): Schema {
  // Usar o schema básico do ProseMirror com listas
  const nodes = addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block')
  const marks = basicSchema.spec.marks

  return new Schema({ nodes, marks })
} 