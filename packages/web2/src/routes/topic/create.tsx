import { operator } from '@mints/request';
import { useRequest } from '@mints/request/react';
import { Card, Input, TextArea, Select, Button } from '@mints/ui';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';

import API from '@/api';

export function TopicCreate() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    sectionId: '',
  });

  const navigate = useNavigate();

  const { data } = useRequest(() => API.section.query());

  const disabled = useMemo(() => {
    return !form.title || !form.content || !form.sectionId;
  }, [form]);

  const handleSubmit = async () => {
    const [success, topicId] = await operator(() => API.topic.create(form));

    if (success) {
      navigate(`/topic/${topicId}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card title="Topic Create" className="w-3xl">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <TextArea
          label="Content"
          className="mt-4"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        />
        <div className="mt-4">
          <label className="font-medium text-zinc-900 dark:text-white flex items-center gap-1 text-base">
            Section
          </label>
          <Select
            options={(data ?? []).map((section) => ({
              label: section.name,
              value: section.id,
            }))}
            value={form.sectionId}
            onChange={(value) =>
              setForm((f) => ({ ...f, sectionId: value as string }))
            }
          />
        </div>
        <div className="mt-4">
          <Button disabled={disabled} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
}
