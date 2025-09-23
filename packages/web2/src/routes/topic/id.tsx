import { useParams } from 'react-router';

export function TopicId() {
  const { topicId } = useParams<{ topicId: string }>();
  return <div>{topicId}</div>;
}
