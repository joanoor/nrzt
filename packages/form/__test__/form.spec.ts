import { BaseStructs, generateFormAndRules } from '../src/formAndRule'

const mockFn = jest.fn()

const formAndRuleRecords1: BaseStructs = [
  {
    label: 'username',
    default: '',
    required: true,
    rule: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    id: '',
  },
  {
    label: 'password',
    default: '',
    required: true,
    rule: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { validator: mockFn, trigger: 'blur' },
    ],
    id: '',
  },
]

const formAndRuleRecords2: BaseStructs = [
  {
    label: 'username',
    default: '',
    required: true,
    rule: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    id: '',
  },
  {
    label: 'password',
    default: '',
    required: true,
    rule: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { validator: mockFn, trigger: 'blur' },
    ],
    id: '',
  },
  {
    label: 'username',
    default: '',
    required: true,
    rule: [{ required: true, message: '请输入用户名001', trigger: 'blur' }],
    id: '001',
  },
  {
    label: 'age',
    default: '',
    required: true,
    rule: [{ required: true, message: '请输入用户年龄', trigger: 'blur' }],
    id: '',
  },
  {
    label: 'password',
    default: '',
    required: true,
    rule: [
      { required: true, message: '请输入密码002', trigger: 'blur' },
      { validator: mockFn, trigger: 'blur' },
    ],
    id: '002',
  },
]

describe('测试表单对象和校验规则生成的结构', () => {
  describe('测试成功的情况', () => {
    test('测试正常传值的情况', () => {
      // 当正常传值时
      const [form, rules] = generateFormAndRules(
        ['username', 'password'],
        formAndRuleRecords1
      )

      expect(form).toEqual({ password: '', username: '' })
      expect(rules).toEqual({
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: mockFn, trigger: 'blur' },
        ],
        username: [
          { message: '请输入用户名', required: true, trigger: 'blur' },
        ],
      })
    })

    test('测试传入空数组时的情况', () => {
      const [form1, rules1] = generateFormAndRules([], formAndRuleRecords1)
      expect(form1).toEqual({})
      expect(rules1).toEqual({})

      const [form2, rules2] = generateFormAndRules(['username', 'password'], [])
      expect(form2).toEqual({})
      expect(rules2).toEqual({})
    })

    test('测试传入不相干的字符串数组', () => {
      const [form, rules] = generateFormAndRules(
        ['age', 'sex'],
        formAndRuleRecords1
      )
      expect(form).toEqual({})
      expect(rules).toEqual({})
    })

    test('测试传入只满足部分的字符串数组', () => {
      const [form, rules] = generateFormAndRules(
        ['age', 'password'],
        formAndRuleRecords1
      )
      expect(form).toEqual({ password: '' })
      expect(rules).toEqual({
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: mockFn, trigger: 'blur' },
        ],
      })
    })

    test('测试传入uniqIds', () => {
      const [form, rules] = generateFormAndRules(
        ['age', 'password'],
        formAndRuleRecords2,
        ['001', '002']
      )
      expect(form).toEqual({ age: '', password: '' })
      expect(rules).toEqual({
        age: [{ required: true, message: '请输入用户年龄', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码002', trigger: 'blur' },
          { validator: mockFn, trigger: 'blur' },
        ],
      })
    })

    test('测试传入重复的uniqIds', () => {
      const [form, rules] = generateFormAndRules(
        ['namess', 'password'],
        formAndRuleRecords2,
        ['001', '002']
      )
      expect(form).toEqual({ password: '' })
      expect(rules).toEqual({
        password: [
          { required: true, message: '请输入密码002', trigger: 'blur' },
          { validator: mockFn, trigger: 'blur' },
        ],
      })
    })
  })

  test('测试失败的情况', () => {
    const formAndRuleRecords3: BaseStructs = [
      {
        label: 'username',
        default: '',
        required: true,
        rule: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        id: '001',
      },
      {
        label: 'password',
        default: '',
        required: true,
        rule: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: mockFn, trigger: 'blur' },
        ],
        id: '002',
      },
      {
        label: 'username',
        default: '',
        required: true,
        rule: [{ required: true, message: '请输入用户名001', trigger: 'blur' }],
        id: '001',
      },
      {
        label: 'age',
        default: '',
        required: true,
        rule: [{ required: true, message: '请输入用户年龄', trigger: 'blur' }],
        id: '',
      },
      {
        label: 'password',
        default: '',
        required: true,
        rule: [
          { required: true, message: '请输入密码002', trigger: 'blur' },
          { validator: mockFn, trigger: 'blur' },
        ],
        id: '002',
      },
    ]
    const formAndRuleRecords4: BaseStructs = [
      {
        label: 'username',
        default: '',
        required: true,
        rule: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        id: '',
      },
      {
        label: 'password',
        default: '',
        required: true,
        rule: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: mockFn, trigger: 'blur' },
        ],
        id: '002',
      },
      {
        label: 'username',
        default: '',
        required: true,
        rule: [{ required: true, message: '请输入用户名001', trigger: 'blur' }],
        id: '001',
      },
      {
        label: 'age',
        default: '',
        required: true,
        rule: [{ required: true, message: '请输入用户年龄', trigger: 'blur' }],
        id: '',
      },
      {
        label: 'password',
        default: '',
        required: true,
        rule: [
          { required: true, message: '请输入密码002', trigger: 'blur' },
          { validator: mockFn, trigger: 'blur' },
        ],
        id: '002',
      },
    ]
    expect(() =>
      generateFormAndRules(['username', 'password'], formAndRuleRecords3)
    ).toThrow(
      `提供的数据有误。存在“label重复，id也重复”的情况。发生于索引为：0,2的数据中`
    )
    expect(() =>
      generateFormAndRules(['username', 'password'], formAndRuleRecords4)
    ).toThrow(
      `提供的数据有误。存在“label重复，id也重复”的情况。发生于索引为：1,4的数据中`
    )
  })
})
