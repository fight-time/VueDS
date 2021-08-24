import request from "@/utils/request.js"

function getUser(userInfo){
    return request({
        url:"/users",
        method:'get',
        params:userInfo
    })
}
function addUsers(addForm){
    console.log(addForm)
    return request({
        url:"/users",
        method:'POST',
        data:addForm
    })
}
export {getUser,addUsers} 