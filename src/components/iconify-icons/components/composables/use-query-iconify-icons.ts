import { useProRequest } from '@/composables/use-pro-request'
import http from '@/utils/axios'

export function useQueryIconifyIcons(){
  const {
    loading,
    data:icons,
    run:queryIcons
  } = useProRequest((query:string,limit:number) => {
    return http(`https://api.iconify.design/search?query=${query}&limit=${limit}`).then(res =>{
      console.log(res,'res')
      return []
    })
  },{
    manual:true,
    debounceWait:1000
  })

  return {
    icons,
    loading,
    queryIcons
  }
}
