import { Render, type Data } from '@puckeditor/core';
import { puckConfig } from '@/puck/config';

export default function PuckRender({ data }: { data: Data }) {
  return <Render config={puckConfig} data={data} />;
}
