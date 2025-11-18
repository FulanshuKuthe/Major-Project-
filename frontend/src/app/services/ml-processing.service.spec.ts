import { TestBed } from "@angular/core/testing";
import { MlProcessingService } from "./ml-processing.service";

describe("MlProcessingService", () => {
  let service: MlProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MlProcessingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
