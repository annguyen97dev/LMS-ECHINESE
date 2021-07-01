export default function TitlePageHeader({ title }: { title: string }) {
  return (
    <div className="title-page">
      <h6 className="text">{title}</h6>
    </div>
  );
}
