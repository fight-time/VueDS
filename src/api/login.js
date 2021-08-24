import request from "@/utils/request.js"

export function loginByUsername(userName,userPwd){
    return request({
        url:"/login",
        method:'POST',
        data:{
            'username':userName,
            'password':userPwd,
        }
    })
}