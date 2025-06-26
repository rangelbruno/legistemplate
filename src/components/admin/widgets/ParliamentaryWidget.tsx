import { useEffect, useRef, FC } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSSVariableValue } from '../../../_metronic/assets/ts/_utils'
import { useThemeMode } from '../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import { KTIcon } from '../../../_metronic/helpers'

// Widget para Usuários Ativos
type UserStatsProps = {
  className?: string
  chartHeight?: string
  backGroundColor?: string
  userCount: number
}

export const UsersStatsWidget: FC<UserStatsProps> = ({
  className = '',
  backGroundColor = '#F7D9E3',
  chartHeight = '100px',
  userCount
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, getUsersChartOptions(chartHeight))
    if (chart) {
      chart.render()
    }
    return chart
  }

  useEffect(() => {
    const chart = refreshChart()
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode])

  return (
    <div
      className={`card ${className} theme-dark-bg-body`}
      style={{ backgroundColor: backGroundColor }}
    >
      <div className='card-body d-flex flex-column'>
        <div className='d-flex flex-column flex-grow-1'>
          <div className='d-flex align-items-center mb-3'>
            <KTIcon iconName='profile-user' className='fs-2x text-gray-800 me-3' />
            <a href='#' className='text-gray-900 text-hover-primary fw-bolder fs-3'>
              Usuários Ativos
            </a>
          </div>
          <div
            ref={chartRef}
            className='users-widget-chart'
            style={{ height: chartHeight, minHeight: chartHeight }}
          ></div>
        </div>
        <div className='pt-5'>
          <span className='text-gray-900 fw-bolder fs-2x lh-0'>{userCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

// Widget para Proposições
type PropositionStatsProps = {
  className?: string
  chartHeight?: string
  backGroundColor?: string
  propositionCount: number
}

export const PropositionStatsWidget: FC<PropositionStatsProps> = ({
  className = '',
  backGroundColor = '#CBF0F4',
  chartHeight = '100px',
  propositionCount
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, getPropositionsChartOptions(chartHeight))
    if (chart) {
      chart.render()
    }
    return chart
  }

  useEffect(() => {
    const chart = refreshChart()
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode])

  return (
    <div
      className={`card ${className} theme-dark-bg-body`}
      style={{ backgroundColor: backGroundColor }}
    >
      <div className='card-body d-flex flex-column'>
        <div className='d-flex flex-column flex-grow-1'>
          <div className='d-flex align-items-center mb-3'>
            <KTIcon iconName='document' className='fs-2x text-gray-800 me-3' />
            <a href='#' className='text-gray-900 text-hover-primary fw-bolder fs-3'>
              Proposições Ativas
            </a>
          </div>
          <div
            ref={chartRef}
            className='propositions-widget-chart'
            style={{ height: chartHeight, minHeight: chartHeight }}
          ></div>
        </div>
        <div className='pt-5'>
          <span className='text-gray-900 fw-bolder fs-2x lh-0'>{propositionCount}</span>
        </div>
      </div>
    </div>
  )
}

// Widget para Sessões
type SessionStatsProps = {
  className?: string
  chartHeight?: string
  backGroundColor?: string
  sessionCount: number
  period: string
}

export const SessionStatsWidget: FC<SessionStatsProps> = ({
  className = '',
  backGroundColor = '#CBD4F4',
  chartHeight = '100px',
  sessionCount,
  period
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, getSessionsChartOptions(chartHeight))
    if (chart) {
      chart.render()
    }
    return chart
  }

  useEffect(() => {
    const chart = refreshChart()
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode])

  return (
    <div
      className={`card ${className} theme-dark-bg-body`}
      style={{ backgroundColor: backGroundColor }}
    >
      <div className='card-body d-flex flex-column'>
        <div className='d-flex flex-column flex-grow-1'>
          <div className='d-flex align-items-center mb-3'>
            <KTIcon iconName='calendar' className='fs-2x text-gray-800 me-3' />
            <a href='#' className='text-gray-900 text-hover-primary fw-bolder fs-3'>
              Sessões Plenárias
            </a>
          </div>
          <div
            ref={chartRef}
            className='sessions-widget-chart'
            style={{ height: chartHeight, minHeight: chartHeight }}
          ></div>
        </div>
        <div className='pt-5'>
          <span className='text-gray-900 fw-bolder fs-2x lh-0'>{sessionCount}</span>
          <span className='text-gray-900 fw-bolder fs-6 lh-0 ms-2'>{period}</span>
        </div>
      </div>
    </div>
  )
}

// Configurações dos gráficos
const getUsersChartOptions = (chartHeight: string): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-800')
  const strokeColor = getCSSVariableValue('--bs-gray-300') as string

  return {
    series: [
      {
        name: 'Usuários Ativos',
        data: [820, 932, 901, 934, 1290, 1330, 1247]
      }
    ],
    grid: {
      show: false,
      padding: { top: 0, bottom: 0, left: 0, right: 0 }
    },
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: chartHeight,
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: true }
    },
    plotOptions: {},
    legend: { show: false },
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [20, 120, 120, 120]
      }
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: ['#FFFFFF']
    },
    xaxis: {
      categories: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false }
    },
    yaxis: {
      min: 0,
      max: 1500,
      labels: { show: false }
    }
  }
}

const getPropositionsChartOptions = (chartHeight: string): ApexOptions => {
  return {
    series: [
      {
        name: 'Proposições',
        data: [65, 59, 80, 81, 56, 78, 89]
      }
    ],
    grid: {
      show: false,
      padding: { top: 0, bottom: 0, left: 0, right: 0 }
    },
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: true }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '60%'
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    fill: {
      type: 'solid',
      colors: ['#00D4AA']
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: { show: false }
    }
  }
}

const getSessionsChartOptions = (chartHeight: string): ApexOptions => {
  return {
    series: [
      {
        name: 'Sessões',
        data: [4, 6, 5, 8, 7, 5, 6]
      }
    ],
    grid: {
      show: false,
      padding: { top: 0, bottom: 0, left: 0, right: 0 }
    },
    chart: {
      fontFamily: 'inherit',
      type: 'line',
      height: chartHeight,
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: true }
    },
    plotOptions: {},
    legend: { show: false },
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.3,
        opacityTo: 0.1
      }
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: ['#6366F1']
    },
    xaxis: {
      categories: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false }
    },
    yaxis: {
      min: 0,
      max: 10,
      labels: { show: false }
    }
  }
} 