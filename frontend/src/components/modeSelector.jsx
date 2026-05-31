const ModeSelector = ({ mode, setMode }) => {
  return (
    <select
      className="mode-selector"
      value={mode}
      onChange={(e) => setMode(e.target.value)}
    >
      <option value="normal">Normal Chat</option>
      <option value="code_explainer">Code Explainer</option>
      <option value="summarizer">Text Summarizer</option>
      <option value="interview_helper">Interview Helper</option>
    </select>
  );
};

export default ModeSelector;