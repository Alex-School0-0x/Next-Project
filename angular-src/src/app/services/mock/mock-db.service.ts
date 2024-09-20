import { inject, Injectable } from '@angular/core';
import { ActiveQuestionnaire, User, QuestionTemplate } from '../../models/questionare';
import { LocalStorageService } from '../misc/local-storage.service';
import { AppSettings } from '../../models/setting-models';


interface Answer {
  questionId: number;
  selectedOptionId?: number;
  customAnswer?: string;
}

interface UserAnswerSheet {
  user: User; // Reference to the User object instead of just ID
  answers: Answer[];
  answeredAt: Date;
}

interface AnswerSession {
  questionnaireId: string;
  studentAnswers: UserAnswerSheet;
  teacherAnswers: UserAnswerSheet;
}


@Injectable({
  providedIn: 'root'
})
export class MockDbService {
  private localStorageKey = 'mockData';
  private localStorageService = inject(LocalStorageService);

  private predefinedMockData: {
    mockUsers: User[],
    mockAnswers: AnswerSession[],
    mockActiveQuestionnaire: ActiveQuestionnaire[],
    mockQuestionTemplates: QuestionTemplate[],
    mockAppSettings: AppSettings,
    mockLogs: { [key: string]: string[] } 
  } = {
    mockUsers: [
      { id: 1, userName: "MJ", fullName: "Max Jacobsen", role: "teacher" },
      { id: 2, userName: "NN", fullName: "Nicklas Nilsson", role: "student" },
      { id: 3, userName: "AS", fullName: "Alexander Svensson", role: "student" },
      { id: 4, userName: "JW", fullName: "Johan Wallin", role: "student" }
    ],
    mockAnswers: [
      {
        questionnaireId: "efgh",
        studentAnswers: {
          user: { id: 2, userName: "NN", fullName: "Nicklas Nilsson", role: "student" },
          answers: [
            { questionId: 1, selectedOptionId: 1 },
            { questionId: 2, selectedOptionId: 2 },
            { questionId: 3, customAnswer: 'More interactive activities would be great!' },
            { questionId: 4, selectedOptionId: 2 },
          ],
          answeredAt: new Date()
        },
        teacherAnswers: {
          user: { id: 1, userName: "MJ", fullName: "Max Jacobsen", role: "teacher" },
          answers: [
            { questionId: 1, selectedOptionId: 1 },
            { questionId: 2, selectedOptionId: 1 },
            { questionId: 3, customAnswer: 'Better resources and tools for students are needed.' },
            { questionId: 4, selectedOptionId: 1 },
          ],
          answeredAt: new Date()
        }
      }
    ],
    mockActiveQuestionnaire: [
      {
        id: "efgh",
        student: { id: 2, userName: "NN", fullName: "Nicklas Nilsson", role: "student" },
        teacher: { id: 1, userName: "MJ", fullName: "Max Jacobsen", role: "teacher" },
        isStudentFinished: true,
        isTeacherFinished: true,
        questionnaireTemplate: {
          templateId: 'template1',
          title: 'Employee Performance Review',
          description: 'A template for assessing employee performance in various aspects of their job.'
        }
      },
      {
        id: "ijkl",
        student: { id: 3, userName: "AS", fullName: "Alexander Svensson", role: "student" },
        teacher: { id: 1, userName: "MJ", fullName: "Max Jacobsen", role: "teacher" },
        isStudentFinished: false,
        isTeacherFinished: false,
        questionnaireTemplate: {
          templateId: 'template1',
          title: 'Employee Performance Review',
          description: 'A template for assessing employee performance in various aspects of their job.'
        }
      }
    ],
    mockQuestionTemplates: [
      {
        templateId: 'template1',
        title: 'Employee Performance Review',
        description: 'A template for assessing employee performance in various aspects of their job.',
        questions: [
          {
            id: 1,  // Unique ID for each question
            title: 'Indlæringsevne',
            options: [
              { id: 1, value: 1, label: 'Viser lidt eller ingen forståelse for arbejdsopgaverne' },
              { id: 2, value: 2, label: 'Forstår arbejdsopgaverne, men kan ikke anvende den i praksis. Har svært ved at tilegne sig ny viden' },
              { id: 3, value: 3, label: 'Let ved at forstå arbejdsopgaverne og anvende den i praksis. Har let ved at tilegne sig ny viden.' },
              { id: 4, value: 4, label: 'Mindre behov for oplæring end normalt. Kan selv finde/tilegne sig ny viden.' },
              { id: 5, value: 5, label: 'Behøver næsten ingen oplæring. Kan ved selvstudium, endog ved svært tilgængeligt materiale, tilegne sig ny viden.' }
            ]
          },
          {
            id: 2,  // Unique ID for each question
            title: 'Kreativitet og selvstændighed',
            options: [
              { id: 1, value: 1, label: 'Viser intet initiativ. Er passiv, uinteresseret og uselvstændig' },
              { id: 2, value: 2, label: 'Viser ringe initiativ. Kommer ikke med løsningsforslag. Viser ingen interesse i at tilægge eget arbejde.' },
              { id: 3, value: 3, label: 'Viser normalt initiativ. Kommer selv med løsningsforslag. Tilrettelægger eget arbejde.' },
              { id: 4, value: 4, label: 'Meget initiativrig. Kommer selv med løsningsforslag. Gode evner for at tilrettelægge eget og andres arbejde.' },
              { id: 5, value: 5, label: 'Overordentlig initiativrig. Løser selv problemerne. Tilrettelægger selvstændigt arbejdet for mig selv og andre.' }
            ]
          },
          {
            id: 3,  // Unique ID for each question
            title: 'Arbejdsindsats',
            options: [
              { id: 1, value: 1, label: 'Uacceptabel' },
              { id: 2, value: 2, label: 'Under middel' },
              { id: 3, value: 3, label: 'Middel' },
              { id: 4, value: 4, label: 'Over middel' },
              { id: 5, value: 5, label: 'Særdeles god' }
            ]
          },
          {
            id: 4,  // Unique ID for each question
            title: 'Orden og omhyggelighed',
            options: [
              { id: 1, value: 1, label: 'Omgås materialer, maskiner og værktøj på en sløset og ligegyldig måde. Holder ikke sin arbejdsplads ordentlig.' },
              { id: 2, value: 2, label: 'Bruger maskiner og værktøj uden megen omtanke. Mindre god orden og omhyggelighed.' },
              { id: 3, value: 3, label: 'Bruger maskiner, materialer og værktøj med påpasselighed og omhyggelighed middel. Rimelig god orden.' },
              { id: 4, value: 4, label: 'Meget påpasselig både i praktik og teori. God orden.' },
              { id: 5, value: 5, label: 'I høj grad påpasselig. God forståelse for materialevalg. Særdeles god orden.' }
            ]
          }
        ]
      }
    ],
    mockAppSettings: {
      auth: {
        accessTokenExpireMinutes: 30,
        algorithm: 'HS256',
        domain: 'localhost',
        ldapBaseDn: 'dc=example,dc=com',
        ldapServer: 'ldap://localhost',
        scopes: {
          admin: 'admin',
          student: 'student',
          teacher: 'teacher'
        },
        secretKey: null
      },
      database: {
        databaseDriver: null,
        databaseType: 'mysql',
        dbName: 'program.db',
        host: null,
        maxConnections: null,
        minConnections: null,
        password: null,
        port: null,
        sslCaCertFile: null,
        sslCertFile: null,
        sslKeyFile: null,
        timeout: null,
        useSsl: false,
        user: null
      }
    },
    mockLogs: {
      sql: [
        '[2024-09-20 09:53:54] [DEBUG] sqlalchemy.orm.mapper.Mapper: (Option|options) _configure_property(options, _RelationshipDeclared)',
        '[2024-09-20 09:53:54] [DEBUG] sqlalchemy.orm.mapper.Mapper: (QuestionTemplate|question_templates) Col (\'cid\', \'name\', \'type\', \'notnull\', \'dflt_value\', \'pk\')',
        '[2024-09-20 09:53:54] [INFO] sqlalchemy.orm.mapper.Mapper: (Question|questions) BEGIN (implicit)',
        '[2024-09-20 09:53:55] [INFO] sqlalchemy.orm.mapper.Mapper: (Question|questions) Identified primary key columns',
        '[2024-09-20 09:53:55] [DEBUG] sqlalchemy.orm.mapper.Mapper: (Option|options) PRAGMA main.table_info("options")'
      ],
      backend: [
        '[2024-09-20 09:53:56] [DEBUG] backend.service.Service: Initiating request to /api/questions',
        '[2024-09-20 09:53:56] [INFO] backend.database.Connection: Created new connection to backend database',
        '[2024-09-20 09:53:57] [WARN] backend.cache.CacheManager: Cache miss for key "question_list"',
        '[2024-09-20 09:53:57] [DEBUG] backend.service.Service: Response received from /api/questions with status 200',
        '[2024-09-20 09:53:58] [INFO] backend.database.Transaction: Transaction committed'
      ],
      settingsManager: [
        '[2024-09-20 09:53:59] [INFO] settings.Manager: Loading configuration from file settings.yaml',
        '[2024-09-20 09:53:59] [DEBUG] settings.Validator: Validating setting "max_connections"',
        '[2024-09-20 09:54:00] [INFO] settings.Manager: Applying new settings for max_connections=10',
        '[2024-09-20 09:54:01] [DEBUG] settings.Manager: Saving configuration to file settings.yaml',
        '[2024-09-20 09:54:02] [WARN] settings.Validator: Invalid value for "timeout", using default of 30 seconds'
      ]
    }
    

  };
  

  public mockData = { ...this.predefinedMockData };

  loadInitialMockData() {
    const savedData = this.localStorageService.getData(this.localStorageKey);
    if (savedData) {
      this.mockData = JSON.parse(savedData);
    } else {
      this.mockData = { ...this.predefinedMockData };
      this.saveData();
    }
  }

  saveData() {
    this.localStorageService.saveData(this.localStorageKey, JSON.stringify(this.mockData));
  }
}
