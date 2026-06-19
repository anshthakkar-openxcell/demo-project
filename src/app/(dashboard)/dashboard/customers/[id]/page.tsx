import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Customer360 } from "@/features/customers/components/customer-360";
import { getCustomerById } from "@/lib/mock-data";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const customer = getCustomerById(id);
  return { title: customer?.name ?? "Customer" };
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const customer = getCustomerById(id);
  if (!customer) notFound();
  return <Customer360 customer={customer} />;
}
