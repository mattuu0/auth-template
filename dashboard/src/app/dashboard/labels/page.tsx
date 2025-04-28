import { LabelTable } from "@/components/dashboard/label-table"
import { PageHeader } from "@/components/dashboard/page-header"
import { LabelCreateButton } from "@/components/dashboard/label-create-button"

export default function LabelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="ラベル管理" description="ユーザーに割り当てるラベルを管理します" />
        <LabelCreateButton />
      </div>
      <LabelTable />
    </div>
  )
}
