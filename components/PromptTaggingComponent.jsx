import React, { useEffect, useRef, useState } from 'react';

const API_ENDPOINT_TEMPLATE = (promptId) => `/api/prompts/${promptId}/tags`;

async function saveTagsToBackend(promptId, tags) {
  const endpoint = API_ENDPOINT_TEMPLATE(promptId);
  console.groupCollapsed('[PromptTaggingComponent] Saving tags');
  console.log('Endpoint:', endpoint);
  console.log('Payload:', tags);
  console.groupEnd();

  try {
    // Placeholder network request. Replace with real fetch/axios implementation as needed.
    await Promise.resolve();
  } catch (error) {
    console.error('Failed to persist tags for prompt', promptId, error);
    throw error;
  }
}

const normalizeTag = (rawTag) => rawTag.trim().toLowerCase();

const PromptTaggingComponent = ({ promptId, initialTags = [], onTagsUpdated }) => {
  const [tags, setTags] = useState(() => initialTags.map(normalizeTag));
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setTags(initialTags.map(normalizeTag));
  }, [initialTags]);

  const persistTags = async (nextTags) => {
    if (typeof onTagsUpdated === 'function') {
      onTagsUpdated(nextTags);
    }

    try {
      await saveTagsToBackend(promptId, nextTags);
    } catch (error) {
      console.error('Unable to save tags:', error);
    }
  };

  const handleAddTag = () => {
    const normalized = normalizeTag(inputValue);

    if (!normalized || tags.includes(normalized)) {
      setInputValue('');
      return;
    }

    const nextTags = [...tags, normalized];
    setTags(nextTags);
    setInputValue('');
    persistTags(nextTags);
  };

  const handleRemoveTag = (tagToRemove) => {
    const nextTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(nextTags);
    persistTags(nextTags);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    } else if (event.key === 'Escape') {
      setInputValue('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className="tagging-widget" aria-label="Prompt tags">
      <div className="tag-container" role="list">
        {tags.map((tag) => (
          <span key={tag} className="tag-item" role="listitem">
            <span className="tag-label">{tag}</span>
            <button
              type="button"
              className="tag-remove"
              aria-label={`Remove ${tag}`}
              onClick={() => handleRemoveTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
        <div className="tag-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="tag-input"
            placeholder="Add a tag"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Add a tag"
          />
          <button type="button" className="tag-add" onClick={handleAddTag}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export const PromptTaggingExample = () => {
  const [tags, setTags] = useState(['creative', 'marketing']);

  return (
    <section className="prompt-tagging-example">
      <h2 className="example-title">Prompt Tagging Demo</h2>
      <PromptTaggingComponent
        promptId="demo-prompt"
        initialTags={tags}
        onTagsUpdated={setTags}
      />
      <p className="example-tags">Current tags: {tags.join(', ') || 'None'}</p>
    </section>
  );
};

export default PromptTaggingComponent;
