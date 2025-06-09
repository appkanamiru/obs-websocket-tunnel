import AgentDetails from '@/components/agent_details'
import AgentName from '@/components/agent_name'
import ConnectionStatus from '@/components/connection_status'
import ObsDetails from '@/components/obs_details'

export default function Page() {
  return (
    <main className="flex flex-col items-center gap-8 mt-4">
      <div className="flex flex-col gap-2">
        <AgentName />
        <ConnectionStatus />
      </div>
      <AgentDetails />
      <ObsDetails />
    </main>
  )
}
