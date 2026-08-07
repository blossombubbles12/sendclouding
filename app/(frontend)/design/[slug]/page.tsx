import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import {
  getProductBySlug,
  getDefaultTemplate,
  getTemplateById,
  getPayloadClient,
  getProductImage,
  type PayloadProduct,
  type PayloadTemplate,
} from "@/lib/data";
import { CustomerDesigner } from "@/components/design/CustomerDesigner";

export const revalidate = 60;

function toClientProduct(product: PayloadProduct) {
  const image = getProductImage(product);
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: image?.url ?? null,
    imageAlt: image?.alt ?? product.name,
  };
}

function toClientTemplate(template: PayloadTemplate) {
  return {
    id: template.id,
    title: template.title,
    templateVersion: template.templateData?.templateVersion,
    designJSON: template.templateData?.templateJSON ?? null,
    canvas: template.canvas
      ? { width: template.canvas.width, height: template.canvas.height, unit: template.canvas.unit, dpi: template.canvas.dpi }
      : null,
  };
}

export default async function DesignPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ design?: string }>;
}) {
  const { slug } = await params;
  const { design: designId } = await searchParams;

  const product = await getProductBySlug(slug);
  if (!product) notFound();
  if (!product.isCustomizable) notFound();

  let template: PayloadTemplate | null = null;
  let initialDesignJSON: unknown = null;

  if (designId) {
    try {
      const payload = await getPayloadClient();
      const found = await payload.findByID({
        collection: "designs",
        id: designId,
        depth: 1,
      });
      const design = found as unknown as {
        designJSON?: unknown;
        template?: string | { id?: string } | null;
      };
      initialDesignJSON = design.designJSON ?? null;
      const tplId = typeof design.template === "string" ? design.template : design.template?.id;
      if (tplId) template = await getTemplateById(tplId);
    } catch {
      initialDesignJSON = null;
    }
  } else {
    template = await getDefaultTemplate(product.id);
  }

  return (
    <section className="bg-white py-10 sm:py-14">
      <Container>
        <CustomerDesigner
          product={toClientProduct(product)}
          template={template ? toClientTemplate(template) : null}
          customization={product.customization}
          existingDesignId={designId || null}
          initialDesignJSON={initialDesignJSON}
        />
      </Container>
    </section>
  );
}