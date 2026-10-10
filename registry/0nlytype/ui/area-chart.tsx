"use client"

import { ChartLines, type LineChartProps } from "@/registry/0nlytype/ui/line-chart"

type AreaChartProps = LineChartProps

/**
 * Volume as a barcode: no fill, only hairlines dropped from the line to the baseline at a close,
 * even rhythm. Several series stack, each band its own rhythm, and the readout sums them.
 */
function AreaChart(props: AreaChartProps) {
  return <ChartLines {...props} area />
}

export { AreaChart, type AreaChartProps }
