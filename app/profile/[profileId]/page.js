export default async function Page({ params }) {
  const { profileId } = await params;
  return (
    <div>
      <h1>Profile Page</h1>
      <h2>{profileId}</h2>
    </div>
  );
}
