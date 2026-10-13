// customer.service.ts
type Dependencies = {
  customerRepository: CustomerRepository;
  userService: Pick<UserService, 'getById'>;
};

export class CustomerService {
  private readonly customerRepository: CustomerRepository;
  private readonly userService: Pick<UserService, 'getById'>;

  constructor({ customerRepository, userService }: Dependencies) {
    this.customerRepository = customerRepository;
    this.userService = userService;
  }
}
