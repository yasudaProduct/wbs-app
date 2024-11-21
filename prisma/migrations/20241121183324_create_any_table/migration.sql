-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "wbs" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "wbs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wbs_phase" (
    "id" SERIAL NOT NULL,
    "wbs_id" INTEGER NOT NULL,
    "phase_template_id" INTEGER,
    "seq" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "is_template_based" BOOLEAN NOT NULL,

    CONSTRAINT "wbs_phase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phase_template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "phase_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wbs_task" (
    "id" TEXT NOT NULL,
    "wbs_id" INTEGER NOT NULL,
    "phase_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "tanto_id" INTEGER,
    "kijun_start_date" TIMESTAMP(3) NOT NULL,
    "kijun_end_date" TIMESTAMP(3) NOT NULL,
    "kijun_kosu" INTEGER NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',

    CONSTRAINT "wbs_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskStatusLog" (
    "id" SERIAL NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL,
    "changedBy" INTEGER,

    CONSTRAINT "TaskStatusLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "phase_template_name_key" ON "phase_template"("name");

-- AddForeignKey
ALTER TABLE "wbs" ADD CONSTRAINT "wbs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wbs_phase" ADD CONSTRAINT "wbs_phase_wbs_id_fkey" FOREIGN KEY ("wbs_id") REFERENCES "wbs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wbs_phase" ADD CONSTRAINT "wbs_phase_phase_template_id_fkey" FOREIGN KEY ("phase_template_id") REFERENCES "phase_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wbs_task" ADD CONSTRAINT "wbs_task_wbs_id_fkey" FOREIGN KEY ("wbs_id") REFERENCES "wbs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wbs_task" ADD CONSTRAINT "wbs_task_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "wbs_phase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wbs_task" ADD CONSTRAINT "wbs_task_tanto_id_fkey" FOREIGN KEY ("tanto_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskStatusLog" ADD CONSTRAINT "TaskStatusLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "wbs_task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskStatusLog" ADD CONSTRAINT "TaskStatusLog_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
