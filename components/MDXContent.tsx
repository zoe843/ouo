import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/components/MDXComponents";

export default function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose-custom">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
