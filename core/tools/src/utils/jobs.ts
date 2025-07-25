export const jobList = [
  {
    label: '公务员',
    value: '01',
  },
  {
    label: '事业单位员工',
    value: '02',
  },
  {
    label: '企业高管',
    value: '03',
  },
  {
    label: '私营业主',
    value: '04',
  },
  {
    label: '金融从业人员',
    value: '05',
  },
  {
    label: '律师',
    value: '06',
  },
  {
    label: '会计师',
    value: '07',
  },
  {
    label: '医护人员',
    value: '08',
  },
  {
    label: '学生',
    value: '09',
  },
  {
    label: '公司员工',
    value: '10',
  },
  {
    label: '商业服务',
    value: '11',
  },
  {
    label: '工人',
    value: '12',
  },
  {
    label: '农林渔牧副',
    value: '13',
  },
  {
    label: '军人武警',
    value: '14',
  },
  {
    label: '文体工作者',
    value: '15',
  },
  {
    label: '家庭主妇',
    value: '16',
  },
  {
    label: '退休',
    value: '17',
  },
  {
    label: '自由职业者',
    value: '18',
  },
  {
    label: '司机',
    value: '20',
  },
  {
    label: '其他',
    value: '19',
  },
];

export function getJobName(value: string) {
  const job = jobList.find((item) => item.value === value);

  return job ? job.label : '';
}
