import { TestBed } from '@angular/core/testing';

import { Blog.ServiceService } from './blog.service.service';

describe('Blog.ServiceService', () => {
  let service: Blog.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Blog.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
