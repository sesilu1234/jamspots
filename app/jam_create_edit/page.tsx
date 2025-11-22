import EditSections from './EditSections';
import EditArea from './EditArea';

export default function Home() {
  return (
    <div className="flex ">
      <div className="min-h-screen w-1/4 bg-[rgb(30,30,30)]">
        <EditSections />
      </div>

      <div className="min-h-screen w-3/4 bg-[#ffffff]">
        <EditArea />
      </div>
    </div>
  );
}
