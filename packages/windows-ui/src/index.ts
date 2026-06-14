import type { App } from 'vue'
import './styles/variables.css'
import './styles/base.css'
import { setGlobalLocale, registerLocale } from './locale'

// Components
import WButton from './components/button/button.vue'
import WBorder from './components/border/border.vue'
import WColor from './components/color/color.vue'
import WContainer from './components/container/container.vue'
import WIcon from './components/icon/icon.vue'
import WLayout from './components/layout/layout.vue'
import WLink from './components/link/link.vue'
import WText from './components/text/text.vue'
import WScrollbar from './components/scrollbar/scrollbar.vue'
import WSpace from './components/space/space.vue'
import WSplitter from './components/splitter/splitter.vue'
import WTypography from './components/typography/typography.vue'
import WConfigProvider from './components/config-provider/config-provider.vue'
import WAutocomplete from './components/autocomplete/autocomplete.vue'
import WCascader from './components/cascader/cascader.vue'
import WCheckbox from './components/checkbox/checkbox.vue'
import WColorPickerPanel from './components/color-picker-panel/color-picker-panel.vue'
import WColorPicker from './components/color-picker/color-picker.vue'
import WDatePickerPanel from './components/date-picker-panel/date-picker-panel.vue'
import WDatePicker from './components/date-picker/date-picker.vue'
import WDateTimePicker from './components/date-time-picker/date-time-picker.vue'
import WForm from './components/form/form.vue'
import WFormItem from './components/form/form-item.vue'
import WInput from './components/input/input.vue'
import WInputNumber from './components/input-number/input-number.vue'
import WInputTag from './components/input-tag/input-tag.vue'
import WInputOTP from './components/input-otp/input-otp.vue'
import WMention from './components/mention/mention.vue'
import WRadio from './components/radio/radio.vue'
import WRate from './components/rate/rate.vue'
import WSelect from './components/select/select.vue'
import WVirtualizedSelect from './components/virtualized-select/virtualized-select.vue'
import WSlider from './components/slider/slider.vue'
import WSwitch from './components/switch/switch.vue'
import WTimePicker from './components/time-picker/time-picker.vue'
import WTimeSelect from './components/time-select/time-select.vue'
import WTransfer from './components/transfer/transfer.vue'
import WTreeSelect from './components/tree-select/tree-select.vue'
import WUpload from './components/upload/upload.vue'
import WRichText from './components/rich-text/rich-text.vue'
import WAvatar from './components/avatar/avatar.vue'
import WBadge from './components/badge/badge.vue'
import WCalendar from './components/calendar/calendar.vue'
import WCard from './components/card/card.vue'
import WCarousel from './components/carousel/carousel.vue'
import WCollapse from './components/collapse/collapse.vue'
import WDescriptions from './components/descriptions/descriptions.vue'
import WEmpty from './components/empty/empty.vue'
import WImage from './components/image/image.vue'
import WInfiniteScroll from './components/infinite-scroll/infinite-scroll.vue'
import WPagination from './components/pagination/pagination.vue'
import WProgress from './components/progress/progress.vue'
import WResult from './components/result/result.vue'
import WSkeleton from './components/skeleton/skeleton.vue'
import WTable from './components/table/table.vue'
import type { ColumnItem } from './components/table/table.vue'
import WVirtualizedTable from './components/virtualized-table/virtualized-table.vue'
import WTag from './components/tag/tag.vue'
import WTimeline from './components/timeline/timeline.vue'
import WTour from './components/tour/tour.vue'
import WTree from './components/tree/tree.vue'
import WVirtualizedTree from './components/virtualized-tree/virtualized-tree.vue'
import WStatistic from './components/statistic/statistic.vue'
import WSegmented from './components/segmented/segmented.vue'
import WAffix from './components/affix/affix.vue'
import WAnchor from './components/anchor/anchor.vue'
import WBacktop from './components/backtop/backtop.vue'
import WBreadcrumb from './components/breadcrumb/breadcrumb.vue'
import WDropdown from './components/dropdown/dropdown.vue'
import WMenu from './components/menu/menu.vue'
import WPageHeader from './components/page-header/page-header.vue'
import WSteps from './components/steps/steps.vue'
import WTabs from './components/tabs/tabs.vue'
import WAlert from './components/alert/alert.vue'
import WDialog from './components/dialog/dialog.vue'
import WDrawer from './components/drawer/drawer.vue'
import WLoading from './components/loading/loading.vue'
import WMessage from './components/message/message.vue'
import WMessageBox from './components/message-box/message-box.vue'
import WNotification from './components/notification/notification.vue'
import WPopconfirm from './components/popconfirm/popconfirm.vue'
import WPopover from './components/popover/popover.vue'
import WTooltip from './components/tooltip/tooltip.vue'
import WDivider from './components/divider/divider.vue'
import WWatermark from './components/watermark/watermark.vue'
import WAdminLayout from './components/admin-layout/admin-layout.vue'
import WSearchForm from './components/search-form/search-form.vue'
import WPageContainer from './components/page-container/page-container.vue'
import WPermission from './components/permission/permission.vue'
import WCrudTable from './components/crud-table/crud-table.vue'
import WDynamicForm from './components/dynamic-form/dynamic-form.vue'
import WQueryBuilder from './components/query-builder/query-builder.vue'
import WMonacoEditor from './components/monaco-editor/monaco-editor.vue'

const components = [
  WButton,
  WBorder,
  WColor,
  WContainer,
  WIcon,
  WLayout,
  WLink,
  WText,
  WScrollbar,
  WSpace,
  WSplitter,
  WTypography,
  WConfigProvider,
  WAutocomplete,
  WCascader,
  WCheckbox,
  WColorPickerPanel,
  WColorPicker,
  WDatePickerPanel,
  WDatePicker,
  WDateTimePicker,
  WForm,
  WFormItem,
  WInput,
  WInputNumber,
  WInputTag,
  WInputOTP,
  WMention,
  WRadio,
  WRate,
  WSelect,
  WVirtualizedSelect,
  WSlider,
  WSwitch,
  WTimePicker,
  WTimeSelect,
  WTransfer,
  WTreeSelect,
  WUpload,
  WRichText,
  WAvatar,
  WBadge,
  WCalendar,
  WCard,
  WCarousel,
  WCollapse,
  WDescriptions,
  WEmpty,
  WImage,
  WInfiniteScroll,
  WPagination,
  WProgress,
  WResult,
  WSkeleton,
  WTable,
  WVirtualizedTable,
  WTag,
  WTimeline,
  WTour,
  WTree,
  WVirtualizedTree,
  WStatistic,
  WSegmented,
  WAffix,
  WAnchor,
  WBacktop,
  WBreadcrumb,
  WDropdown,
  WMenu,
  WPageHeader,
  WSteps,
  WTabs,
  WAlert,
  WDialog,
  WDrawer,
  WLoading,
  WMessage,
  WMessageBox,
  WNotification,
  WPopconfirm,
  WPopover,
  WTooltip,
  WDivider,
  WWatermark,
  WAdminLayout,
  WSearchForm,
  WPageContainer,
  WPermission,
  WCrudTable,
  WDynamicForm,
  WQueryBuilder,
  WMonacoEditor
]

export interface WindowsUIOptions {
  locale?: string
  messages?: Record<string, string>
}

function install(app: App, options?: WindowsUIOptions) {
  components.forEach((component) => {
    app.component(component.name as string, component)
  })
  if (options?.locale) {
    if (options.messages) {
      registerLocale(options.locale, options.messages)
    }
    setGlobalLocale(options.locale)
  }
}

export {
  WButton,
  WBorder,
  WColor,
  WContainer,
  WIcon,
  WLayout,
  WLink,
  WText,
  WScrollbar,
  WSpace,
  WSplitter,
  WTypography,
  WConfigProvider,
  WAutocomplete,
  WCascader,
  WCheckbox,
  WColorPickerPanel,
  WColorPicker,
  WDatePickerPanel,
  WDatePicker,
  WDateTimePicker,
  WForm,
  WFormItem,
  WInput,
  WInputNumber,
  WInputTag,
  WInputOTP,
  WMention,
  WRadio,
  WRate,
  WSelect,
  WVirtualizedSelect,
  WSlider,
  WSwitch,
  WTimePicker,
  WTimeSelect,
  WTransfer,
  WTreeSelect,
  WUpload,
  WRichText,
  WAvatar,
  WBadge,
  WCalendar,
  WCard,
  WCarousel,
  WCollapse,
  WDescriptions,
  WEmpty,
  WImage,
  WInfiniteScroll,
  WPagination,
  WProgress,
  WResult,
  WSkeleton,
  WTable,
  ColumnItem,
  WVirtualizedTable,
  WTag,
  WTimeline,
  WTour,
  WTree,
  WVirtualizedTree,
  WStatistic,
  WSegmented,
  WAffix,
  WAnchor,
  WBacktop,
  WBreadcrumb,
  WDropdown,
  WMenu,
  WPageHeader,
  WSteps,
  WTabs,
  WAlert,
  WDialog,
  WDrawer,
  WLoading,
  WMessage,
  WMessageBox,
  WNotification,
  WPopconfirm,
  WPopover,
  WTooltip,
  WDivider,
  WWatermark,
  WAdminLayout,
  WSearchForm,
  WPageContainer,
  WPermission,
  WCrudTable,
  WDynamicForm,
  WQueryBuilder,
  WMonacoEditor
}

export type { FormRule } from './components/form/form.vue'
export type { DynamicField } from './components/dynamic-form/dynamic-form.vue'
export type { QueryField, QueryCondition } from './components/query-builder/query-builder.vue'
export {
  useLocale,
  setGlobalLocale,
  registerLocale,
  getGlobalLocale,
  getLocaleMessages,
  zhCN,
  enUS
} from './locale'
export type { LocaleType, LocaleMessages, LocaleContext } from './locale'

export default {
  install
}
