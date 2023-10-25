import { Injectable } from '@nestjs/common';
import { Message } from 'js-sha512';
import { JwtAuthDto } from 'src/auth/dto';
import { DbService } from 'src/db/db.service';
import {
  AccountTools,
  Keystore,
  registerAccount,
  VulcanHebe,
} from 'vulcan-api-js';
import { VulcanDto } from './dto/vulcan.dto';

@Injectable()
export class VulcanService {
  constructor(private readonly prisma: DbService) {}

  private async getClient(userId: number): Promise<VulcanHebe> {
    const keystore = new Keystore();
    const tokens = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        certificate: true,
        fingerprint: true,
        privateKey: true,
        firebaseToken: true,
      },
    });
    (keystore.loadFromObject as any)({
      ...tokens,
      deviceModel: 'HackHeroes2023',
    });

    const {
      restURL: { url },
      loginID,
      email,
    }: {
      restURL: any;
      loginID: number | null;
      email: string;
    } = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        loginID: true,
        email: true,
        restURL: {
          select: { url: true },
        },
      },
    });
    if (loginID === null) throw Error('LoginID cannot be null!');

    const client = new VulcanHebe(
      keystore,
      AccountTools.loadFromObject({
        loginId: loginID ?? 0,
        userLogin: email,
        userName: email,
        restUrl: url,
      }),
    );
    await client.selectStudent();
    return client;
  }

  async register(vulcanData: VulcanDto, user: JwtAuthDto): Promise<object> {
    const keystore = new Keystore();
    await keystore.init('HackHeroes2023');

    const vulcanAccount = await registerAccount(
      keystore,
      vulcanData.token,
      vulcanData.symbol,
      vulcanData.pin,
    );
    const vulcanClient = new VulcanHebe(
      keystore,
      AccountTools.loadFromObject(vulcanAccount),
    );
    await vulcanClient.selectStudent();

    const student = (await vulcanClient.getStudents())[0];
    const lastSemester = student.periods.at(-1);
    const schoolName = student.unit.name;
    const lesson = (await vulcanClient.getLessons(lastSemester?.start.Date))[0];
    const restURL = await this.prisma.restURL.upsert({
      create: {
        url: vulcanAccount.restUrl,
      },
      where: {
        url: vulcanAccount.restUrl,
      },
      update: {},
    });

    await this.prisma.user.update({
      where: { id: user.userId },
      data: {
        firstName: student.pupil.firstName,
        lastName: student.pupil.surname,
        schoolClass: lastSemester?.level + (lesson?.class?.symbol ?? ''),
        schoolName: schoolName,
        loginID: student.pupil.loginId,
        restURLId: restURL.id,
        certificate: keystore.certificate,
        fingerprint: keystore.fingerprint,
        privateKey: keystore.privateKey,
        firebaseToken: keystore.firebaseToken,
      },
    });

    return {
      msg: 'Successfully registered an UONET+ account',
    };
  }

  async deleteVulcanAccount(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        loginID: null,
        restURLId: null,
        certificate: null,
        fingerprint: null,
        privateKey: null,
        firebaseToken: null,
      },
    });
  }
  async getSemester(client: VulcanHebe, semesterNumber: number) {
    if (semesterNumber !== 1 && semesterNumber !== 2)
      throw Error('Semester number must be 1 or 2');
    const student = (await client.getStudents())[0];
    return student.periods.at(semesterNumber === 1 ? -2 : -1);
  }

  async getGrades(userId: number, last?: number): Promise<object> {
    const client = await this.getClient(userId);
    const grades = (await client.getGrades(new Date('1970'))).slice(
      last ? -last : 0,
    );
    const returnObject: { [key: string]: object[] } = {};
    grades.forEach((grade) => {
      const key = grade.column.subject.name;
      if (!returnObject[key]) returnObject[key] = [];
      returnObject[key].push({
        id: grade.id,
        grade: grade.content,
        teacher: grade.creator.displayName,
        dateCreated: grade.dateCreated.dateDisplay,
        weight: grade.column.weight,
        name: grade.column.name,
        type: grade.column.category?.name,
      });
    });
    return returnObject;
  }

  async getLessons(from: Date, to: Date, userId: number) {
    const client = await this.getClient(userId);
    return client.getLessons(from, to);
  }

  async getLuckyNumber(userId: number) {
    const client = await this.getClient(userId);
    return client.getLuckyNumber();
  }

  async getStudent(userId: number) {
    const client = await this.getClient(userId);
    return (await client.getStudents())[0];
  }

  async getMessages(userId: number): Promise<Message[]> {
    const client = await this.getClient(userId);
    const messageBoxId = (await client.getMessageBoxes())[0].globalKey;
    return client.getMessages(messageBoxId);
  }

  async getHomework(userId: number) {
    const client = await this.getClient(userId);
    return client.getHomework();
  }
  async getExams(userId: number, last?: number): Promise<any[]> {
    const client = await this.getClient(userId);
    let exams = (await client.getExams())
      .filter((exam) => {
        const timeNow = new Date();
        timeNow.setHours(0, 0, 0, 0);
        return new Date(exam.deadline.date) >= timeNow;
      })
      .sort((a, b) => {
        const dateA = new Date(a.deadline.date);
        const dateB = new Date(b.deadline.date);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
      });
    if (last) exams = exams.slice(-last);

    return exams.map((exam) => {
      return {
        id: exam.id,
        subject: exam.subject.name,
        deadline: exam.deadline.dateDisplay,
        description: exam.topic,
        teacherName: exam.creator.displayName,
        type: exam.type,
      };
    });
  }

  async getAttendance(userId: number, day: Date) {
    const client = await this.getClient(userId);
    const data = await client.getAttendance(day, day);
    const newData = data.map((item) => {
      return {
        id: item.id,
        lessonId: item.lessonId,
        replacament: item.replacament,
        subject: {
          id: item.subject.id,
          name: item.subject.name,
          code: item.subject.code,
        },
        teacher: {
          id: item.teacher.id,
          name: item.teacher.displayName,
        },
        date: item.date.dateDisplay,
        position: item.time.position,
        time: item.time.display,
        presenceType: {
          symbol: item.presenceType.symbol,
          presence: item.presenceType.presence,
          absence: item.presenceType.absence,
          exemption: item.presenceType.exemption,
          late: item.presenceType.late,
          justified: item.presenceType.justified,
          deleted: item.presenceType.deleted,
        },
      };
    });
    return newData.sort((a, b) => {
      return a.position - b.position;
    });
  }

  async isActivated(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        loginID: true,
        restURLId: true,
        certificate: true,
        fingerprint: true,
        privateKey: true,
        firebaseToken: true,
      },
    });
    const isActivated =
      user.loginID !== null &&
      user.restURLId !== null &&
      user.certificate !== null &&
      user.fingerprint !== null &&
      user.privateKey !== null &&
      user.firebaseToken !== null;
    return {
      isActivated: isActivated,
    };
  }
}
