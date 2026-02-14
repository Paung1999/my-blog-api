import {faker} from '@faker-js/faker';
import {prisma} from '../lib/prisma';
import bcrypt from 'bcrypt';
import {Role} from "../generated/prisma/enums"


async function main() {
    
    console.log('Seeding...');

    await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'alice@gmail.com',
            password: await bcrypt.hash('password',10),
            role: Role.ADMIN
        }
    });
    await prisma.user.create({
        data: {
            name: 'Bob',
            email: 'bob@gmail.com',
            password: await bcrypt.hash('password',10)
        }
    });
    for(let i = 0; i < 20 ; i++){
        await prisma.post.create({
            data: {
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                authorId: faker.number.int({min:1 , max: 2})
            }
        });
    }
    for(let i=0; i<40 ; i++){
        await prisma.comment.create({
            data: {
                content: faker.lorem.sentence(),
                postId: faker.number.int({min:1, max:20}),
                userId: faker.number.int({min:1, max:2})
            }
        });
    }

    console.log('Seeding finished.');

}

main()
    .then(async()=> {
    await prisma.$disconnect();
    })
    .catch(async(e)=>{
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);

    })