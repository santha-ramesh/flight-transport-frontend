import { TestBed } from '@angular/core/testing';
import { PricePipe, DurationPipe, TimezonePipe, DateOnlyPipe } from './index';

describe('PricePipe', () => {
  let pipe: PricePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PricePipe]
    });
    pipe = TestBed.inject(PricePipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format price to USD currency', () => {
    expect(pipe.transform(1000)).toBe('$1,000.00');
    expect(pipe.transform(460.5)).toBe('$460.50');
    expect(pipe.transform(10)).toBe('$10.00');
  });

  it('should handle zero', () => {
    expect(pipe.transform(0)).toBe('$0.00');
  });
});

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DurationPipe]
    });
    pipe = TestBed.inject(DurationPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert minutes to hours and minutes', () => {
    expect(pipe.transform(60)).toBe('1h 0m');
    expect(pipe.transform(90)).toBe('1h 30m');
    expect(pipe.transform(420)).toBe('7h 0m');
    expect(pipe.transform(45)).toBe('0h 45m');
  });

  it('should handle zero', () => {
    expect(pipe.transform(0)).toBe('0h 0m');
  });
});

describe('TimezonePipe', () => {
  let pipe: TimezonePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimezonePipe]
    });
    pipe = TestBed.inject(TimezonePipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format ISO time to HH:mm', () => {
    expect(pipe.transform('2026-07-10T08:00:00Z')).toBe('08:00');
    expect(pipe.transform('2026-07-10T15:30:00Z')).toBe('15:30');
    expect(pipe.transform('2026-07-10T00:45:00Z')).toBe('00:45');
  });
});

describe('DateOnlyPipe', () => {
  let pipe: DateOnlyPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateOnlyPipe]
    });
    pipe = TestBed.inject(DateOnlyPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format ISO date to readable format', () => {
    expect(pipe.transform('2026-07-10T08:00:00Z')).toBe('Jul 10, 2026');
    expect(pipe.transform('2026-01-01T00:00:00Z')).toBe('Jan 1, 2026');
    expect(pipe.transform('2026-12-25T12:30:00Z')).toBe('Dec 25, 2026');
  });
});
