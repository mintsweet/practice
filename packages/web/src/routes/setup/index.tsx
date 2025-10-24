import { operator } from '@mints/request';
import { Input, Button, Callout, Calendar, Plus, CircleAlert } from '@mints/ui';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import API from '@/api';
import { useSetup } from '@/setup-context';

type RootUser = {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
};

type SectionItem = { name: string; description: string };
type TagItem = { name: string; description: string };

export function Setup() {
  const [step, setStep] = useState(1);
  const [root, setRoot] = useState<RootUser>({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [sections, setSections] = useState<SectionItem[]>([
    { name: '', description: '' },
  ]);
  const [tags, setTags] = useState<TagItem[]>([{ name: '', description: '' }]);
  const [error, setError] = useState<Record<string, string> | null>(null);

  const [operating, setOperating] = useState(false);

  const { initialized, updateInitialized } = useSetup();

  const navigate = useNavigate();

  useEffect(() => {
    if (initialized) {
      navigate('/', { replace: true });
    }
  }, [initialized, navigate]);

  const handleSubmit = async () => {
    const [success] = await operator(
      () =>
        API.setup.initializeSystem({
          root,
          sections: sections.filter((s) => s.name.trim() !== ''),
          tags: tags.filter((t) => t.name.trim() !== ''),
        }),
      {
        setOperating,
      },
    );

    if (success) {
      updateInitialized(true);
      navigate('/', { replace: true });
    }
  };

  const addSection = () => {
    setSections([...sections, { name: '', description: '' }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (
    index: number,
    field: 'name' | 'description',
    value: string,
  ) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const addTag = () => {
    setTags([...tags, { name: '', description: '' }]);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTag = (
    index: number,
    field: 'name' | 'description',
    value: string,
  ) => {
    const updated = [...tags];
    updated[index][field] = value;
    setTags(updated);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!root.email || !root.password || !root.nickname) {
        setError({ root: 'Please fill in all root user fields' });
        return;
      }
      if (root.password !== root.confirmPassword) {
        setError({ root: 'Passwords do not match' });
        return;
      }
    }

    if (step === 2) {
      if (sections.length === 0 || sections.some((s) => !s.name)) {
        setError({ sections: 'Please add at least one section with a name' });
        return;
      }
    }

    if (step === 3) {
      if (tags.length === 0 || tags.some((t) => !t.name)) {
        setError({ tags: 'Please add at least one tag with a name' });
        return;
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-zinc-900 mb-2">
            <Calendar size={40} />
            <span>System Setup</span>
          </h1>
          <p className="text-zinc-600">
            Let&apos;s configure your system in 3 simple steps
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-200 text-zinc-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 transition-colors ${
                    step > s ? 'bg-zinc-900' : 'bg-zinc-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                    Create Root Account
                  </h2>
                  <p className="text-sm text-zinc-600 mb-6">
                    This will be the primary root account
                  </p>
                </div>

                {error?.root && (
                  <Callout variant="danger">{error.root}</Callout>
                )}

                <Input
                  label="Email Address"
                  value={root.email}
                  onChange={(e) => setRoot({ ...root, email: e.target.value })}
                  placeholder="root@example.com"
                  required
                />

                <Input
                  label="Nickname"
                  value={root.nickname}
                  onChange={(e) =>
                    setRoot({ ...root, nickname: e.target.value })
                  }
                  placeholder="Root"
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  value={root.password}
                  onChange={(e) =>
                    setRoot({ ...root, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  value={root.confirmPassword}
                  onChange={(e) =>
                    setRoot({ ...root, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                    Create Sections
                  </h2>
                  <p className="text-sm text-zinc-600 mb-6">
                    Add categories to organize your forum topics
                  </p>
                </div>

                <div className="space-y-3">
                  {error?.sections && (
                    <Callout variant="danger">{error.sections}</Callout>
                  )}

                  {sections.map((section, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <Input
                        type="text"
                        placeholder="Name"
                        value={section.name}
                        onChange={(e) =>
                          updateSection(index, 'name', e.target.value)
                        }
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Description"
                        value={section.description}
                        onChange={(e) =>
                          updateSection(index, 'description', e.target.value)
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeSection(index)}
                        disabled={sections.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  className="w-full"
                  icon={<Plus />}
                  variant="dashed"
                  onClick={addSection}
                >
                  Add Section
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                    Create Tags
                  </h2>
                  <p className="text-sm text-zinc-600 mb-6">
                    Add tags to help categorize topics
                  </p>
                </div>

                <div className="space-y-3">
                  {error?.tags && (
                    <Callout variant="danger">{error.tags}</Callout>
                  )}

                  {tags.map((tag, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <Input
                        type="text"
                        placeholder="Name"
                        value={tag.name}
                        onChange={(e) =>
                          updateTag(index, 'name', e.target.value)
                        }
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Description"
                        value={tag.description}
                        onChange={(e) =>
                          updateTag(index, 'description', e.target.value)
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeTag(index)}
                        disabled={tags.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  className="w-full"
                  icon={<Plus />}
                  variant="dashed"
                  onClick={addTag}
                >
                  Add Tag
                </Button>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button type="button" className="w-full" onClick={prevStep}>
                  Previous
                </Button>
              )}

              {step < 3 ? (
                <Button type="button" className="w-full" onClick={nextStep}>
                  Next Step
                </Button>
              ) : (
                <Button
                  type="button"
                  className="w-full"
                  disabled={operating}
                  onClick={handleSubmit}
                >
                  {operating ? 'Initializing...' : 'Complete Setup'}
                </Button>
              )}
            </div>

            {step === 3 && (
              <p className="mt-3 text-xs text-red-400 flex items-center justify-center gap-1">
                <CircleAlert size={16} />
                <span>
                  Once initialized, these settings cannot be changed through
                  this interface
                </span>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
