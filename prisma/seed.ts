// vou usar esse seed para popular o banco com alguns dados iniciais para testes e desenvolvimento, acrescentei no package jason  pra rodar com run dev
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Criar usuário profissional de exemplo
  let professional = await prisma.user.findUnique({
    where: { email: 'professional@example.com' },
  })

  if (!professional) {
    professional = await prisma.user.create({
      data: {
        email: 'professional@example.com',
        name: 'Profissional Exemplo',
        role: 'professional',
        emailVerified: new Date(),
      },
    })
  } else {
    // Atualizar para garantir que é profissional
    professional = await prisma.user.update({
      where: { id: professional.id },
      data: { role: 'professional' },
    })
  }

  console.log('✅ Usuário profissional criado:', professional.email)

  // Criar serviços de exemplo
  const services = [
    {
      name: 'Consulta Médica',
      description: 'Consulta médica geral com duração de 30 minutos',
      duration: 30,
      price: 15000, // R$ 150,00 em centavos
      userId: professional.id,
    },
    {
      name: 'Massagem Relaxante',
      description: 'Sessão de massagem relaxante de 60 minutos',
      duration: 60,
      price: 12000, // R$ 120,00 em centavos
      userId: professional.id,
    },
    {
      name: 'Aula Particular',
      description: 'Aula particular de 45 minutos',
      duration: 45,
      price: 8000, // R$ 80,00 em centavos
      userId: professional.id,
    },
  ]

  for (const service of services) {
    const created = await prisma.service.create({
      data: service,
    })
    console.log('✅ Serviço criado:', created.name)
  }

  // Criar alguns blocos de horário de exemplo
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)

  const scheduleBlocks = [
    {
      userId: professional.id,
      startTime: new Date(tomorrow),
      endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // +2 horas
      isAvailable: true,
    },
    {
      userId: professional.id,
      startTime: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000), // +3 horas
      endTime: new Date(tomorrow.getTime() + 5 * 60 * 60 * 1000), // +5 horas
      isAvailable: true,
    },
  ]

  for (const block of scheduleBlocks) {
    const created = await prisma.scheduleBlock.create({
      data: block,
    })
    console.log('✅ Bloco de horário criado:', created.id)
  }

  console.log('🎉 Seed concluído!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

