// echarts.d.ts

declare namespace ECharts {
    interface InitOptions {
        // 声明初始化选项的基础结构
        renderer?: 'canvas' | 'svg';
        width?: number | string;
        height?: number | string;
        devicePixelRatio?: number;
        // ... 更多其他属性
    }
    interface EChartOption {
        type?: 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'map' | 'tree' | 'treemap' | 'graph' | 'gauge' | 'funnel' | 'parallel' | 'sankey' | 'boxplot' | 'candlestick' | 'effectScatter' | 'lines' | 'heatmap' | 'pictorialBar' | 'themeRiver' | 'sunburst' | 'custom';
        // 声明图表配置项的基础结构
        title?: {
            text?: string;
            subtext?: string;
            // ... 更多标题相关属性
        };
        tooltip?: {
            trigger?: 'item' | 'axis' | 'none';
            axisPointer?: boolean | { type?: 'line' | 'shadow'; lineStyle?: any };
            [key: string]: any

            // ... 更多提示框相关属性
        };
        grid?: {
            containLabel?: boolean;
            left?: number | string;
            top?: number | string;
            right?: number | string;
            bottom?: number | string;
            // ... 更多网格相关属性
        };
        xAxis?: {
            type?: 'category' | 'value' | 'log' | 'time' | 'timeLog' | 'interval';
            data?: any[];
            axisPointer?: boolean | { type?: 'line' | 'shadow' };
            splitLine?: any;
            [key: string]: any

            // ... 更多 x 轴相关属性
        };
        yAxis?: {
            type?: 'category' | 'value' | 'log' | 'time' | 'timeLog' | 'interval';
            axisLine?: any;
            splitLine?: any;
            [key: string]: any;
            // ... 更多 y 轴相关属性
        };
        series?: {
            type?: 'line' | 'bar' | 'pie' | 'scatter' | 'effectScatter' | 'radar' | 'tree' | 'treemap' | 'sunburst' | 'boxplot' | 'candlestick' | 'heatmap' | 'map' | 'parallel' | 'lines' | 'graph' | 'gauge' | 'pictorialBar' | 'themeRiver' | 'sunburst' | 'custom';
            data?: any[];
            smooth?: number | boolean;
            [key: string]: any
            // ... 更多系列相关属性
        }[];
        // ... 更多图表配置项属性
    }
    namespace graphic {
        interface LinearGradientObject {
            // 类型定义省略...
        }

        class LinearGradient implements Gradient {
            constructor(x: number, y: number, x2: number, y2: number, stops: Array<{
                offset: number,
                color: string,
            }>, globalCoord?: boolean);
        }
    }
    class ECharts {
        constructor(dom: HTMLElement | string, options?: InitOptions);

        setOption(option: EChartOption, notMerge?: boolean, lazyUpdate?: boolean): void;
        resize(): void;
        dispose(): void;
        // ... 声明 ECharts 类的其他方法
    }
}

declare const echarts: {
    init(element: string | HTMLElement, opts?: ECharts.InitOptions): ECharts.ECharts;
    connect(group: string[], option?: any): void;
    disConnect(group: string[]): void;
    dispose(chartInstance: ECharts.ECharts): void;
    getInstanceByDom(dom: HTMLElement): ECharts.ECharts;
    registerMap(mapName: string, geoJson: object, specialAreas?: object): void;
    graphic
    // ... 声明 echarts 函数的其他静态方法
};

declare module 'echarts' {
    export = echarts;
}