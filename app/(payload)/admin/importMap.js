import {
	CollectionCards as CollectionCards_0,
	FolderField as FolderField_1,
	FolderTableCell as FolderTableCell_2,
} from "@payloadcms/next/rsc";
import { VercelBlobClientUploadHandler as VercelBlobClientUploadHandler_3 } from "@payloadcms/storage-vercel-blob/client";
import { Logo as Logo_4 } from "./components/graphics/Logo";
import { Icon as Icon_5 } from "./components/graphics/Icon";
import { Nav as Nav_custom } from "./components/graphics/Nav";
import { default as BeforeDashboard_6 } from "./components/dashboard/BeforeDashboard";
import { StatusBadge as StatusBadge_7 } from "./components/StatusBadge";
import { TemplateBuilderView as TemplateBuilderView_8 } from "./components/template-builder/TemplateView";

/** @type import('payload').ImportMap */
export const importMap = {
	"@payloadcms/next/rsc#CollectionCards": CollectionCards_0,
	"@payloadcms/next/rsc#FolderField": FolderField_1,
	"@payloadcms/next/rsc#FolderTableCell": FolderTableCell_2,
	"@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler": VercelBlobClientUploadHandler_3,
	"/components/graphics/Logo#Logo": Logo_4,
	"/components/graphics/Icon#Icon": Icon_5,
	"/components/graphics/Nav#Nav": Nav_custom,
	"/components/dashboard/BeforeDashboard#default": BeforeDashboard_6,
	"/components/StatusBadge#StatusBadge": StatusBadge_7,
	"/components/template-builder/TemplateView#TemplateBuilderView": TemplateBuilderView_8,
};
