import { Fragment } from "react";
import { loadDefaultJapaneseParser } from "budoux";

const parser = loadDefaultJapaneseParser();

/**
 * Japanese phrase-aware line breaking (BudouX).
 *
 * Wraps Japanese text so it only breaks at natural 文節 boundaries instead of
 * mid-word. Inserts <wbr> between phrases; the `.jp` class sets
 * `word-break: keep-all` so no other break points are used. Works in every
 * browser (incl. iOS Safari), unlike `word-break: auto-phrase`.
 *
 * Non-string children (JSX with <br>, <span>, …) are passed through untouched.
 */
export default function Jp({ children, as: Tag = "span", className = "", ...rest }) {
  if (typeof children !== "string") {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }
  const segments = parser.parse(children);
  return (
    <Tag className={`jp ${className}`} {...rest}>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {seg}
          {i < segments.length - 1 && <wbr />}
        </Fragment>
      ))}
    </Tag>
  );
}
