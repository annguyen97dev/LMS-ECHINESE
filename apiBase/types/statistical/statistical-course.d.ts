type IStatCourse = IBaseApi<
  {
    Month: number;
    RepeatedCustomer: number;
    UniqueCustomer: number;
    CompletedClass: number;
    OnGoingClass: number;
    PlannedClass: number;
  }[]
>;
