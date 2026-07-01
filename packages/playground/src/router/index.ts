import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '../views/Layout.vue'
import Home from '../pages/Home.vue'
import BasicPage from '../pages/BasicPage.vue'
import FormPage from '../pages/FormPage.vue'
import DataPage from '../pages/DataPage.vue'
import NavPage from '../pages/NavPage.vue'
import FeedbackPage from '../pages/FeedbackPage.vue'
import OthersPage from '../pages/OthersPage.vue'
import AllComponentsPage from '../pages/components/AllComponentsPage.vue'
import ButtonPage from '../pages/components/ButtonComponentPage.vue'
import BorderPage from '../pages/components/BorderComponentPage.vue'
import ColorPage from '../pages/components/ColorComponentPage.vue'
import ContainerPage from '../pages/components/ContainerComponentPage.vue'
import IconPage from '../pages/components/IconComponentPage.vue'
import LayoutPage from '../pages/components/LayoutComponentPage.vue'
import LinkPage from '../pages/components/LinkComponentPage.vue'
import TextPage from '../pages/components/TextComponentPage.vue'
import ScrollbarPage from '../pages/components/ScrollbarComponentPage.vue'
import SpacePage from '../pages/components/SpaceComponentPage.vue'
import SplitterPage from '../pages/components/SplitterComponentPage.vue'
import TypographyPage from '../pages/components/TypographyComponentPage.vue'
import ConfigproviderPage from '../pages/components/ConfigproviderComponentPage.vue'
import InputPage from '../pages/components/InputComponentPage.vue'
import InputNumberPage from '../pages/components/InputNumberComponentPage.vue'
import InputTagPage from '../pages/components/InputTagComponentPage.vue'
import InputOtpPage from '../pages/components/InputOtpComponentPage.vue'
import AutocompletePage from '../pages/components/AutocompleteComponentPage.vue'
import CascaderPage from '../pages/components/CascaderComponentPage.vue'
import CheckboxPage from '../pages/components/CheckboxComponentPage.vue'
import ColorPickerPage from '../pages/components/ColorPickerComponentPage.vue'
import ColorPickerPanelPage from '../pages/components/ColorPickerPanelComponentPage.vue'
import DatePickerPage from '../pages/components/DatePickerComponentPage.vue'
import DatePickerPanelPage from '../pages/components/DatePickerPanelComponentPage.vue'
import DatetimePickerPage from '../pages/components/DatetimePickerComponentPage.vue'
import RadioPage from '../pages/components/RadioComponentPage.vue'
import RatePage from '../pages/components/RateComponentPage.vue'
import SelectPage from '../pages/components/SelectComponentPage.vue'
import SliderPage from '../pages/components/SliderComponentPage.vue'
import SwitchPage from '../pages/components/SwitchComponentPage.vue'
import TimePickerPage from '../pages/components/TimePickerComponentPage.vue'
import TimeSelectPage from '../pages/components/TimeSelectComponentPage.vue'
import TransferPage from '../pages/components/TransferComponentPage.vue'
import TreeSelectPage from '../pages/components/TreeSelectComponentPage.vue'
import UploadPage from '../pages/components/UploadComponentPage.vue'
import VirtualizedSelectPage from '../pages/components/VirtualizedSelectComponentPage.vue'
import VirtualizedTablePage from '../pages/components/VirtualizedTableComponentPage.vue'
import VirtualizedTreePage from '../pages/components/VirtualizedTreeComponentPage.vue'
import RichTextPage from '../pages/components/RichTextComponentPage.vue'
import MonacoEditorPage from '../pages/components/MonacoEditorComponentPage.vue'
import AdvancedQueryBuilderPage from '../pages/components/AdvancedQueryBuilderComponentPage.vue'
import MentionPage from '../pages/components/MentionComponentPage.vue'
import FormComponentPage from '../pages/components/FormComponentPage.vue'
import AvatarPage from '../pages/components/AvatarComponentPage.vue'
import BadgePage from '../pages/components/BadgeComponentPage.vue'
import CalendarPage from '../pages/components/CalendarComponentPage.vue'
import CardPage from '../pages/components/CardComponentPage.vue'
import CarouselPage from '../pages/components/CarouselComponentPage.vue'
import CollapsePage from '../pages/components/CollapseComponentPage.vue'
import DescriptionsPage from '../pages/components/DescriptionsComponentPage.vue'
import EmptyPage from '../pages/components/EmptyComponentPage.vue'
import ImagePage from '../pages/components/ImageComponentPage.vue'
import PaginationPage from '../pages/components/PaginationComponentPage.vue'
import ProgressPage from '../pages/components/ProgressComponentPage.vue'
import ResultPage from '../pages/components/ResultComponentPage.vue'
import SkeletonPage from '../pages/components/SkeletonComponentPage.vue'
import TablePage from '../pages/components/TableComponentPage.vue'
import TagPage from '../pages/components/TagComponentPage.vue'
import TimelinePage from '../pages/components/TimelineComponentPage.vue'
import TreePage from '../pages/components/TreeComponentPage.vue'
import StatisticPage from '../pages/components/StatisticComponentPage.vue'
import SegmentedPage from '../pages/components/SegmentedComponentPage.vue'
import TourPage from '../pages/components/TourComponentPage.vue'
import InfiniteScrollPage from '../pages/components/InfiniteScrollComponentPage.vue'
import BreadcrumbPage from '../pages/components/BreadcrumbComponentPage.vue'
import DropdownPage from '../pages/components/DropdownComponentPage.vue'
import MenuPage from '../pages/components/MenuComponentPage.vue'
import PageHeaderPage from '../pages/components/PageHeaderComponentPage.vue'
import StepsPage from '../pages/components/StepsComponentPage.vue'
import TabsPage from '../pages/components/TabsComponentPage.vue'
import BacktopPage from '../pages/components/BacktopComponentPage.vue'
import AnchorPage from '../pages/components/AnchorComponentPage.vue'
import AffixPage from '../pages/components/AffixComponentPage.vue'
import AlertPage from '../pages/components/AlertComponentPage.vue'
import DialogPage from '../pages/components/DialogComponentPage.vue'
import DrawerPage from '../pages/components/DrawerComponentPage.vue'
import LoadingPage from '../pages/components/LoadingComponentPage.vue'
import MessagePage from '../pages/components/MessageComponentPage.vue'
import NotificationPage from '../pages/components/NotificationComponentPage.vue'
import PopconfirmPage from '../pages/components/PopconfirmComponentPage.vue'
import PopoverPage from '../pages/components/PopoverComponentPage.vue'
import TooltipPage from '../pages/components/TooltipComponentPage.vue'
import MessageBoxPage from '../pages/components/MessageBoxComponentPage.vue'
import DividerPage from '../pages/components/DividerComponentPage.vue'
import WatermarkPage from '../pages/components/WatermarkComponentPage.vue'
import AdminLayoutPage from '../pages/components/AdminLayoutComponentPage.vue'
import SearchFormPage from '../pages/components/SearchFormComponentPage.vue'
import PageContainerPage from '../pages/components/PageContainerComponentPage.vue'
import PermissionPage from '../pages/components/PermissionComponentPage.vue'
import CrudTablePage from '../pages/components/CrudTableComponentPage.vue'
import DynamicFormPage from '../pages/components/DynamicFormComponentPage.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'Home', component: Home },

      { path: 'basic', component: BasicPage },
      { path: 'form', component: FormPage },
      { path: 'data', component: DataPage },
      { path: 'nav', component: NavPage },
      { path: 'feedback', component: FeedbackPage },
      { path: 'others', component: OthersPage },
      { path: 'all-components', component: AllComponentsPage },
      { path: 'basic/button', component: ButtonPage },
      { path: 'basic/border', component: BorderPage },
      { path: 'basic/color', component: ColorPage },
      { path: 'basic/container', component: ContainerPage },
      { path: 'basic/icon', component: IconPage },
      { path: 'basic/layout', component: LayoutPage },
      { path: 'basic/link', component: LinkPage },
      { path: 'basic/text', component: TextPage },
      { path: 'basic/scrollbar', component: ScrollbarPage },
      { path: 'basic/space', component: SpacePage },
      { path: 'basic/splitter', component: SplitterPage },
      { path: 'basic/typography', component: TypographyPage },
      { path: 'basic/configprovider', component: ConfigproviderPage },
      { path: 'form/input', component: InputPage },
      { path: 'form/input-number', component: InputNumberPage },
      { path: 'form/input-tag', component: InputTagPage },
      { path: 'form/input-otp', component: InputOtpPage },
      { path: 'form/autocomplete', component: AutocompletePage },
      { path: 'form/cascader', component: CascaderPage },
      { path: 'form/checkbox', component: CheckboxPage },
      { path: 'form/color-picker', component: ColorPickerPage },
      { path: 'form/color-picker-panel', component: ColorPickerPanelPage },
      { path: 'form/date-picker', component: DatePickerPage },
      { path: 'form/date-picker-panel', component: DatePickerPanelPage },
      { path: 'form/datetime-picker', component: DatetimePickerPage },
      { path: 'form/radio', component: RadioPage },
      { path: 'form/rate', component: RatePage },
      { path: 'form/select', component: SelectPage },
      { path: 'form/virtualized-select', component: VirtualizedSelectPage },
      { path: 'form/slider', component: SliderPage },
      { path: 'form/switch', component: SwitchPage },
      { path: 'form/time-picker', component: TimePickerPage },
      { path: 'form/time-select', component: TimeSelectPage },
      { path: 'form/transfer', component: TransferPage },
      { path: 'form/tree-select', component: TreeSelectPage },
      { path: 'form/upload', component: UploadPage },
      { path: 'form/rich-text', component: RichTextPage },
      { path: 'form/monaco-editor', component: MonacoEditorPage },
      { path: 'form/mention', component: MentionPage },
      { path: 'form/form', component: FormComponentPage },
      { path: 'data/avatar', component: AvatarPage },
      { path: 'data/badge', component: BadgePage },
      { path: 'data/calendar', component: CalendarPage },
      { path: 'data/card', component: CardPage },
      { path: 'data/carousel', component: CarouselPage },
      { path: 'data/collapse', component: CollapsePage },
      { path: 'data/descriptions', component: DescriptionsPage },
      { path: 'data/empty', component: EmptyPage },
      { path: 'data/image', component: ImagePage },
      { path: 'data/pagination', component: PaginationPage },
      { path: 'data/progress', component: ProgressPage },
      { path: 'data/result', component: ResultPage },
      { path: 'data/skeleton', component: SkeletonPage },
      { path: 'data/table', component: TablePage },
      { path: 'data/virtualized-table', component: VirtualizedTablePage },
      { path: 'data/virtualized-tree', component: VirtualizedTreePage },
      { path: 'data/tag', component: TagPage },
      { path: 'data/timeline', component: TimelinePage },
      { path: 'data/tree', component: TreePage },
      { path: 'data/statistic', component: StatisticPage },
      { path: 'data/segmented', component: SegmentedPage },
      { path: 'data/tour', component: TourPage },
      { path: 'data/infinite-scroll', component: InfiniteScrollPage },
      { path: 'nav/breadcrumb', component: BreadcrumbPage },
      { path: 'nav/dropdown', component: DropdownPage },
      { path: 'nav/menu', component: MenuPage },
      { path: 'nav/page-header', component: PageHeaderPage },
      { path: 'nav/steps', component: StepsPage },
      { path: 'nav/tabs', component: TabsPage },
      { path: 'nav/backtop', component: BacktopPage },
      { path: 'nav/anchor', component: AnchorPage },
      { path: 'nav/affix', component: AffixPage },
      { path: 'feedback/alert', component: AlertPage },
      { path: 'feedback/dialog', component: DialogPage },
      { path: 'feedback/drawer', component: DrawerPage },
      { path: 'feedback/loading', component: LoadingPage },
      { path: 'feedback/message', component: MessagePage },
      { path: 'feedback/notification', component: NotificationPage },
      { path: 'feedback/popconfirm', component: PopconfirmPage },
      { path: 'feedback/popover', component: PopoverPage },
      { path: 'feedback/tooltip', component: TooltipPage },
      { path: 'feedback/message-box', component: MessageBoxPage },
      { path: 'others/divider', component: DividerPage },
      { path: 'others/watermark', component: WatermarkPage },
      { path: 'basic/admin-layout', component: AdminLayoutPage },
      { path: 'form/search-form', component: SearchFormPage },
      { path: 'others/page-container', component: PageContainerPage },
      { path: 'others/permission', component: PermissionPage },
      { path: 'others/crud-table', component: CrudTablePage },
      { path: 'others/dynamic-form', component: DynamicFormPage },
      { path: 'others/advanced-query-builder', component: AdvancedQueryBuilderPage },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
