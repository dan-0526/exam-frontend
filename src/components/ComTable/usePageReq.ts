import { ref, reactive, watch } from 'vue'

export const usePageReq = (api: (params?: any) => Promise<any>, otherParams: { [x: string]: any }) => {
    // 表格的loading（不需要可以删除）
    const tableLoading = ref(true)
    // 分页的页数和一页的大小
    const pageParams = reactive({
        PageNumber: 1,
        MaxResultCount: 15
    })
    const datas = ref([])
    const totalCount = ref()  //数据的总条数
    let apiOtherParams = ref<{ [key: string]: any }>({})
    const getPage = (serchParms?: Object) => {
        // 处理传过来的参数
        Object.keys(otherParams).forEach(key => {
            let targeParams = otherParams[key]
            if (typeof targeParams === 'object') {
                Object.assign(apiOtherParams.value, targeParams)
            } else {
                // 日期参数date的话，而且数组说明是dateRange，参数才分为start和end, date:[]
                if (key === 'date' && Array.isArray(targeParams)) {
                    apiOtherParams.value['start'] = targeParams[0]
                    apiOtherParams.value['end'] = targeParams[1]
                } else {
                    apiOtherParams.value[key] = targeParams
                }
            }
        })
        // 当页面有查询寻求时，传入的查询参数
        const realSerchParms = serchParms ? { ...serchParms } : ''
        api({
            //请求参数,这里取决于你的接口需要什么参数
            ...pageParams, //分页
            ...apiOtherParams.value, // 请求时除了分页以外的参数
            ...realSerchParms // 查询参数
        }).then(res => {
            // 这里接收你的请求结果，有什么数据需要获取都写在这里
            datas.value = res.items
            tableLoading.value = false
            totalCount.value = Number(res.totalCount)  //后端返回给我的总数是字符串，是数字类型的可以不转换
        })
    }


    watch(() => otherParams, (newVal) => {
        if (newVal) {
            getPage()
        }
    }, { immediate: true, deep: true })

    // 刷新表格再次请求
    const search = () => {
        window.scrollTo(0, 0)
        pageParams.PageNumber = 1
        getPage()
    }

    // 对外面返回你的参数，想返回什么写什么
    return {
        datas,
        pageParams,
        getPage,
        search,
        totalCount,
        tableLoading
    }
}