-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('BUG', 'ENHANCEMENT', 'TASK');

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'HIGH',
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'BUG';
