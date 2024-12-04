/*
  Warnings:

  - Added the required column `name` to the `wbs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wbs" ADD COLUMN     "name" TEXT NOT NULL;
