import React, {useEffect, useRef} from 'react'
import clsx from 'clsx'
import {useLocation} from 'react-router'
import {checkIsActive, KTIcon, WithChildren} from '../../../helpers'
import {useLayout} from '../../core'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
}

const AsideMenuItemWithSub: React.FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet,
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {aside} = config
  const scrollPositionRef = useRef<number>(0)

  // Função simples para prevenir scroll indesejado (aplicada apenas se necessário)
  useEffect(() => {
    // Aplicar prevenção de scroll apenas após o menu estar funcionando
    const timer = setTimeout(() => {
      const menuItems = document.querySelectorAll('.menu-item[data-kt-menu-trigger="click"]')
      menuItems.forEach(item => {
        const link = item.querySelector('.menu-link')
        if (link && !link.hasAttribute('data-scroll-prevention')) {
          link.setAttribute('data-scroll-prevention', 'true')
          
          link.addEventListener('click', () => {
            const scrollPos = window.pageYOffset || document.documentElement.scrollTop
            
            setTimeout(() => {
              const newScrollPos = window.pageYOffset || document.documentElement.scrollTop
              if (Math.abs(newScrollPos - scrollPos) > 50) {
                window.scrollTo({ top: scrollPos, behavior: 'auto' })
              }
            }, 300)
          })
        }
      })
    }, 3000) // Aguardar menu estar completamente inicializado
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={clsx('menu-item', {'here show': isActive}, 'menu-accordion')}
      data-kt-menu-trigger='click'
    >
      <span className='menu-link'>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && aside.menuIcon === 'svg' && (
          <span className='menu-icon'>
            <KTIcon iconName={icon} className='fs-2' />
          </span>
        )}
        {fontIcon && aside.menuIcon === 'font' && <i className={clsx('bi fs-3', fontIcon)}></i>}
        <span className='menu-title'>{title}</span>
        <span className='menu-arrow'></span>
      </span>
      <div className={clsx('menu-sub menu-sub-accordion', {'menu-active-bg': isActive})}>
        {children}
      </div>
    </div>
  )
}

export {AsideMenuItemWithSub}
