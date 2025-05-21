-- CreateTable
CREATE TABLE "PersonRole" (
    "id" TEXT NOT NULL,
    "personId" UUID NOT NULL,
    "roleId" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,

    CONSTRAINT "PersonRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPerson" (
    "userId" TEXT NOT NULL,
    "personId" UUID NOT NULL,

    CONSTRAINT "UserPerson_pkey" PRIMARY KEY ("userId","personId")
);

-- CreateIndex
CREATE INDEX "PersonRole_personId_roleId_organizationId_idx" ON "PersonRole"("personId", "roleId", "organizationId");

-- CreateIndex
CREATE INDEX "PersonRole_createdById_idx" ON "PersonRole"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "PersonRole_personId_roleId_organizationId_key" ON "PersonRole"("personId", "roleId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPerson_userId_key" ON "UserPerson"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPerson_personId_key" ON "UserPerson"("personId");

-- AddForeignKey
ALTER TABLE "PersonRole" ADD CONSTRAINT "PersonRole_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonRole" ADD CONSTRAINT "PersonRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonRole" ADD CONSTRAINT "PersonRole_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonRole" ADD CONSTRAINT "PersonRole_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerson" ADD CONSTRAINT "UserPerson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerson" ADD CONSTRAINT "UserPerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
