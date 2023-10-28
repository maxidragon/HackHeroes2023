import Markdown from "markdown-to-jsx";

export default function MarkdownComponent({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <Markdown
      className={className}
      options={{
        overrides: {
          h1: {
            props: {
              className:
                "text-4xl roboto text-white mb-4 border-b-2 border-gray-500",
            },
          },
          h2: {
            props: {
              className:
                "text-3xl roboto text-white mb-4 border-b-2 border-gray-500",
            },
          },
          h3: {
            props: {
              className:
                "text-2xl roboto text-white mb-4 border-b-2 border-gray-500",
            },
          },
          a: {
            props: {
              className: "text-blue-500",
            },
          },
          p: {
            props: {
              className: "text-lg text-gray-200",
            },
          },
          code: {
            props: {
              className: "text-lg text-white bg-gray-500 p-1 rounded-lg",
            },
          },
          ol: {
            props: {
              className: "list-decimal list-inside",
            },
          },
          ul: {
            props: {
              className: "list-disc list-inside",
            },
          },
          li: {
            props: {
              className: "text-lg text-white",
            },
          },
        },
      }}
    >
      {value || ""}
    </Markdown>
  );
}
