import request from '@/utils/request'


export default {
    test(params){
        return request({
            url:`/test`,
            method:'get',
            params
        })
        
    }
}