import { Button } from "../components/Button"
import { Card } from "../components/Card";
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { ConstCreateModal } from "../components/CreateContentModal";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useContents } from "../hooks/useContents";
import axios from "axios";

function Dashboard() {

  const [ModalOpen, setModalOpen] = useState(false)
  const contents = useContents(); 

  return (
    <>
      <ConstCreateModal
        open={ModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />
      <div className="h-screen w-full bg-slate-100 flex overflow-hidden">
        <Sidebar />
        <div className="w-full px-5">
          <div className="flex justify-end ml-10 gap-2 p-3">
            <Button
              onClick={() => setModalOpen(true)}
              variant="Primary"
              text="Add Content"
              startIcon={<PlusIcon />}
            />
            <Button
              onClick={async () => {
                const response = await axios.post("http://localhost" + ":5000/api/v1/brain/share", {share:true}, { withCredentials: true })
                const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
                alert(shareUrl);
                navigator.clipboard.writeText(shareUrl);
              }}
              variant="Secondary"
              text="Share Brain"
              startIcon={<ShareIcon />}
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            {contents.map(({ link, type, title }) => (
              <Card key={link} title={title} type={type} link={link} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard