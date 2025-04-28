import { UserTable } from "@/components/dashboard/user-table"
import { PageHeader } from "@/components/dashboard/page-header"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="ユーザー管理" description="システムに登録されているユーザーを管理します" />
      <UserTable />
    </div>
  )
}
