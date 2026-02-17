import { AuditCard } from "../audit-types";
import { openclawAudit } from "./openclaw";
import { boltDiyAudit } from "./bolt-diy";

/** All available audits — add new entries here */
export const AUDIT_REGISTRY: AuditCard[] = [
    {
        slug: openclawAudit.slug,
        projectName: openclawAudit.projectName,
        tagline: openclawAudit.projectTagline,
        score: openclawAudit.score,
        totalViolations: openclawAudit.totalViolations,
        filesIndexed: openclawAudit.filesIndexed,
        scanDuration: openclawAudit.scanDuration,
        scanDate: openclawAudit.scanDate,
        gatesFailed: openclawAudit.gatesFailed,
        gatesTotal: openclawAudit.gatesTotal,
        featured: true,
    },
    {
        slug: boltDiyAudit.slug,
        projectName: boltDiyAudit.projectName,
        tagline: boltDiyAudit.projectTagline,
        score: boltDiyAudit.score,
        totalViolations: boltDiyAudit.totalViolations,
        filesIndexed: boltDiyAudit.filesIndexed,
        scanDuration: boltDiyAudit.scanDuration,
        scanDate: boltDiyAudit.scanDate,
        gatesFailed: boltDiyAudit.gatesFailed,
        gatesTotal: boltDiyAudit.gatesTotal,
        featured: false,
    },
];

export { openclawAudit } from "./openclaw";
export { boltDiyAudit } from "./bolt-diy";
