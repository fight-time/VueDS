import request from "@/utils/request.js"

export function getMenu(){
    return request({
        url:"/menus",
        method:'get',
    })
}