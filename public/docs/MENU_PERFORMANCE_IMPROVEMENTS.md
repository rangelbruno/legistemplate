# Melhorias de Performance do Menu Sidebar

## Problema Identificado
O menu sidebar estava causando scroll automático indesejado quando itens de accordion (como "Relatórios" ou "Ferramentas Dev") eram expandidos, especialmente quando localizados na parte inferior do menu.

## Soluções Implementadas

### 1. Hook Customizado `useMenuAccordion`
**Arquivo:** `src/hooks/useMenuAccordion.ts`

**Funcionalidades:**
- Prevenção de scroll automático durante expansão de accordions
- Suporte para múltiplos accordions abertos simultaneamente
- Controle de posição de scroll com restauração automática
- Otimização de performance com listeners inteligentes

**Uso:**
```typescript
const {handleAccordionClick} = useMenuAccordion({
  preventAutoScroll: true,
  expandMultiple: true
})
```

### 2. Componente MenuCustom
**Arquivo:** `src/_metronic/assets/ts/components/MenuCustom.ts`

**Melhorias:**
- Configuração otimizada para accordions múltiplos
- Listeners de eventos para controle de scroll
- Métodos para configuração dinâmica do comportamento
- Prevenção de reflow durante animações

**Métodos principais:**
- `MenuCustom.init()` - Inicialização com configurações otimizadas
- `MenuCustom.enableMultipleAccordions()` - Permite vários accordions abertos
- `MenuCustom.disableAutoScroll()` - Desabilita scroll automático

### 3. CSS Otimizado
**Arquivo:** `src/_metronic/assets/sass/layout/_sidebar-custom.scss`

**Otimizações:**
- `will-change: height` para accordions
- `transform: translateZ(0)` para aceleração GPU
- `contain: layout style` para prevenir reflow
- Transições suavizadas e otimizadas
- Scrollbar customizada para melhor UX

### 4. Componente AsideMenuItemWithSub Aprimorado
**Arquivo:** `src/_metronic/layout/components/aside/AsideMenuItemWithSub.tsx`

**Melhorias:**
- Integração com hook `useMenuAccordion`
- Prevenção de eventos de scroll durante expansão
- Controle preciso de timing de animações

### 5. Inicialização Otimizada
**Arquivo:** `src/_metronic/layout/MasterInit.tsx`

**Mudanças:**
- Substituição do `MenuComponent.bootstrap()` por `MenuCustom.init()`
- Configuração automática para múltiplos accordions
- Desabilitação de scroll automático global

## Benefícios Alcançados

### Performance
- ✅ Eliminação de scroll indesejado durante expansão de menus
- ✅ Redução de reflows e repaints
- ✅ Aceleração GPU para animações
- ✅ Melhor responsividade geral

### Usabilidade
- ✅ Múltiplos accordions podem permanecer abertos
- ✅ Navegação mais fluida e previsível
- ✅ Posição de scroll mantida durante interações
- ✅ Transições mais suaves

### Manutenibilidade
- ✅ Código modular e reutilizável
- ✅ Configurações centralizadas
- ✅ Fácil desabilitação de recursos se necessário
- ✅ Documentação clara de funcionalidades

## Configurações Disponíveis

### Hook useMenuAccordion
```typescript
interface UseMenuAccordionOptions {
  preventAutoScroll?: boolean  // Padrão: true
  expandMultiple?: boolean     // Padrão: true
}
```

### CSS Customizações
```scss
// Velocidade da animação (padrão: 250ms)
.menu-sub-accordion {
  transition: height 0.25s ease !important;
}

// Aceleração GPU
.menu-item.menu-accordion .menu-sub {
  will-change: height;
  transform: translateZ(0);
}
```

## Como Reverter (se necessário)

Para voltar ao comportamento original:

1. No `MasterInit.tsx`, substituir:
```typescript
// Remover
MenuCustom.init()
MenuCustom.enableMultipleAccordions()
MenuCustom.disableAutoScroll()

// Restaurar
MenuComponent.bootstrap()
```

2. No `AsideMenuItemWithSub.tsx`, remover o hook:
```typescript
// Remover
const {handleAccordionClick} = useMenuAccordion(...)
const handleClick = (e: React.MouseEvent) => {
  handleAccordionClick(e)
}

// Restaurar comportamento padrão removendo onClick do menu-link
```

## Testes Recomendados

1. **Teste de Scroll**: Expandir menus na parte inferior da sidebar
2. **Teste de Performance**: Verificar animações suaves em dispositivos lentos
3. **Teste de Múltiplos Accordions**: Manter vários menus expandidos
4. **Teste de Responsividade**: Verificar comportamento em diferentes tamanhos de tela

## Monitoramento

Para monitorar a performance:
```javascript
// Console do navegador
console.time('menu-expansion')
// ... expandir menu
console.timeEnd('menu-expansion')
```

## Próximos Passos

- [ ] Implementar lazy loading para submenus com muitos itens
- [ ] Adicionar animações de entrada/saída mais sofisticadas
- [ ] Implementar keyboard navigation otimizada
- [ ] Adicionar suporte a gestos touch para mobile 