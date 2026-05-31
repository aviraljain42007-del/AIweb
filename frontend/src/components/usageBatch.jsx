import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsageThunk } from "../redux/thunks/usageThunks";

const UsageBadge = () => {
  const dispatch = useDispatch();

  const { usage, loading, error } = useSelector((state) => state.usage);

  useEffect(() => {
    dispatch(getUsageThunk());
  }, [dispatch]);

  if (loading && !usage) {
    return <div className="usage-badge">Loading usage...</div>;
  }

  if (error) {
    return <div className="usage-badge usage-error">{error}</div>;
  }

  if (!usage) {
    return null;
  }

  const used = usage.dailyPrompts;
  const limit = usage.dailyPromptLimit;
  const remaining = usage.remainingPrompts;

  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

  return (
    <div className="usage-badge">
      <div className="usage-top">
        <span>Daily Usage</span>
        <strong>
          {used}/{limit}
        </strong>
      </div>

      <div className="usage-bar">
        <div
          className="usage-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className={remaining <= 3 ? "usage-warning" : "usage-remaining"}>
        {remaining} prompts remaining today
      </p>
    </div>
  );
};

export default UsageBadge;