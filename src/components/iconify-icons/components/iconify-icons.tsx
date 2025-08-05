import type { SlotsType } from 'vue'
import type { ProIconifyIconsSlots } from '../slots'
import { useFieldUtils } from 'pro-naive-ui'
import { computed, defineComponent, inject } from 'vue'
import { NSelect, selectProps, type SelectProps } from 'naive-ui'
import { useQueryIconifyIcons } from './composables/use-query-iconify-icons'

export default defineComponent({
  name: 'IconifyIcons',
  props: selectProps,
  inheritAttrs:false,
  slots: Object as SlotsType<ProIconifyIconsSlots>,
  setup(props) {
    const {
      empty,
      value,
      readonly,
      emptyDom,
    } = useFieldUtils()

    const {
      icons,
      loading,
      queryIcons
    } = useQueryIconifyIcons()

    /**
     * 检测外层是否包裹了 pro-form-clearable-provider 组件
     */
    const injectedFormClearable = inject('pro-form-clearable',null)


    const nSelectProps = computed<SelectProps>(() =>{
      console.log(props.clearable,'props.clearable')
      return {
        ...props,
        remote:true,
        filterable:true,
        options:icons.value,
        loading:loading.value,
        value:props.value ?? null,
        onSearch: handleSearch
        // clearable:
      }
    })

    function handleSearch(query:string){
      if(!query.length){
        icons.value = []
        return
      }
      queryIcons(query,50)
    }

    return {
      nSelectProps
    }
  },
  render() {
    return <NSelect
    {...this.$attrs}
    {...this.nSelectProps}
    v-slots={this.$slots}
  />
  },
})
