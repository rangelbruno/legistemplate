import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toAbsoluteUrl } from '../../_metronic/helpers'
import { buildUrl } from '../../lib/utils/url-helpers'

interface BrandProps {
  variant?: 'full' | 'compact' | 'mini' | 'sidebar'
  showText?: boolean
  className?: string
  to?: string
}

/**
 * Componente Brand para exibir logo e nome do sistema LegisInc
 * Diferentes variantes para diferentes contextos
 */
export const Brand: React.FC<BrandProps> = ({
  variant = 'full',
  showText = true,
  className = '',
  to = '/admin/dashboard'
}) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  // Constrói a URL completa com a base URL do sistema
  const linkTo = to ? buildUrl(to) : ''
  const brandContent = () => {
    switch (variant) {
      case 'full':
        return (
          <div className={`d-flex align-items-center ${className}`}>
            {!imageError ? (
              <img
                alt='LegisInc Logo'
                src={toAbsoluteUrl('media/logos/legisinc.svg')}
                className='h-60px'
                onError={handleImageError}
              />
            ) : (
              showText && (
                <div>
                  <h3 className='text-gray-900 fw-bold mb-0'>LegisInc</h3>
                  <span className='text-muted fs-7'>Sistema Legislativo</span>
                </div>
              )
            )}
          </div>
        )

      case 'compact':
        return (
          <div className={`d-flex align-items-center ${className}`}>
            {!imageError ? (
              <img
                alt='LegisInc Logo'
                src={toAbsoluteUrl('media/logos/legisinc.svg')}
                className='h-50px'
                onError={handleImageError}
              />
            ) : (
              showText && (
                <span className='text-gray-900 fw-bold fs-6'>LegisInc</span>
              )
            )}
          </div>
        )

      case 'mini':
        return (
          <div className={`d-flex align-items-center ${className}`}>
            {!imageError ? (
              <img
                alt='LegisInc Logo'
                src={toAbsoluteUrl('media/logos/legisinc.svg')}
                className='h-45px'
                onError={handleImageError}
              />
            ) : (
              <span className='text-gray-900 fw-bold fs-7'>LI</span>
            )}
          </div>
        )

      case 'sidebar':
        return (
          <div className={`d-flex flex-column align-items-center text-center ${className}`}>
            {!imageError ? (
              <img
                alt='LegisInc Logo'
                src={toAbsoluteUrl('media/logos/legisinc.svg')}
                className='h-100px'
                onError={handleImageError}
              />
            ) : (
              showText && (
                <div>
                  <h4 className='text-gray-900 fw-bolder mb-1'>LegisInc</h4>
                  <span className='text-muted fs-7'>Sistema Legislativo</span>
                </div>
              )
            )}
          </div>
        )

      default:
        return brandContent()
    }
  }

  if (to) {
    return (
      <Link to={linkTo} className='text-decoration-none'>
        {brandContent()}
      </Link>
    )
  }

  return brandContent()
}

export default Brand 