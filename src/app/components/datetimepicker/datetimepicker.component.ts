import { Component, OnInit, Input, forwardRef, ViewChild, AfterViewInit, Injector, Output, EventEmitter } from '@angular/core';
import { NgbTimeStruct, NgbDateStruct, NgbPopoverConfig, NgbPopover, NgbDatepicker, NgbDatepickerConfig, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateTimeModel } from './date-time.model';
import { noop } from 'rxjs';

@Component({
    selector: 'app-datetimepicker',
    templateUrl: './datetimepicker.component.html',
    styleUrls: ['./datetimepicker.component.scss'],
    providers: [
        DatePipe,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatetimepickerComponent),
            multi: true
        }
    ]
})
export class DatetimepickerComponent implements ControlValueAccessor, OnInit, AfterViewInit {
    @Input()
    @Output() onDatePicked: EventEmitter<any> = new EventEmitter<any>();
    dateString: string;

    @Input()
    inputDatetimeFormat = 'd/M/yyyy';
    @Input()
    hourStep = 1;
    @Input()
    minuteStep = 30;
    @Input()
    secondStep = 30;
    @Input()
    seconds = false;

    @Input()
    disabled = false;

    timePickerContent

    public showTimePickerToggle = false;

    public datetime: DateTimeModel = new DateTimeModel();
    
    public firstTimeAssign = true;

    @ViewChild(NgbDatepicker)
    public dp: NgbDatepicker;



    @ViewChild(NgbPopover)
    public popover: NgbPopover;

    public onTouched: () => void = noop;
    public onChange: (_: any) => void = noop;

    public ngControl: NgControl;
    isToday: boolean = false;
    minDate: { year: number; month: number; day: number; };
    hasSelectDate: boolean = false;
    isFirstInterval: boolean = false;
    isSecondInterval: boolean = false;
    interval: any;

    

    json = {
        disable: [0],
        disabledDates: [
            { year: 2020, month: 12, day: 31 },
            { year: 2021, month: 1, day: 1 },
            { year: 2021, month: 1, day: 2 },
            { year: 2021, month: 1, day: 3 },
            { year: 2021, month: 1, day: 4 },
            { year: 2021, month: 1, day: 5 },


        ]
    };
    isDisabled;

    isNewYearTowmorrow: boolean = false;
    isNewYearToday: boolean = false;
    showInterval: boolean;
    

    constructor(
        private config: NgbPopoverConfig,
        private inj: Injector,
        private pickerConfig: NgbDatepickerConfig,
        private calendar: NgbCalendar) {
        config.autoClose = 'outside';
        config.placement = 'auto';
        const current = new Date();
        this.minDate = {
            year: current.getFullYear(),
            month: current.getMonth() + 1,
            day: current.getDate()
        };
    }

    ngOnInit(): void {
        this.ngControl = this.inj.get(NgControl);
        const date = new Date();

        if (date.getFullYear() == 2020 && date.getMonth() == 11 && date.getDate() + 1 == 31) {
            console.log(date.getDate() + 1)
            this.isNewYearTowmorrow = true;
        }

        if (date.getFullYear() == 2020 && date.getMonth() == 11 && date.getDate() == 31)
            this.isNewYearToday = true;

        this.checkIfToday();

        this.isDisabled = (date: NgbDateStruct) => {
            return this.json.disabledDates.find(
                x =>
                    new NgbDate(x.year, x.month, x.day).equals(date) ||
                    this.json.disable.includes(
                        this.calendar.getWeekday(
                            new NgbDate(date.year, date.month, date.day)
                        )
                    )
            )
                ? true
                : false;
        };
    }

    ngAfterViewInit(): void {
        this.popover.hidden.subscribe($event => {
            this.showTimePickerToggle = false;
        });

    }



    checkIfToday() {
        const date = new Date();
        const todayDate = date.getDate();
        const dd = date.getDate();
        const mm = date.getMonth() + 1;
        const yyyy = date.getFullYear();

        if (this.datetime.year === yyyy && this.datetime.month === mm && this.datetime.day === dd) {
            this.isToday = true;
        } else {
            this.isToday = false;
        }

        this.hasSelectDate = true;

        if (date.getHours() < 11)
            this.isFirstInterval = true;

        if (date.getHours() < 18)
            this.isSecondInterval = true;

        if (date.getDay() == 5) {
            this.json = {
                disable: [0],
                disabledDates: [
                    { year: yyyy, month: mm, day: dd},
                    { year: yyyy, month: mm, day: dd + 1 },
                    { year: yyyy, month: mm, day: dd + 2 },
                ]
            };
        } else if (date.getDay() == 6) {
            this.json = {
                disable: [0],
                disabledDates: [
                    { year: yyyy, month: mm, day: dd},
                    { year: yyyy, month: mm, day: dd + 2 },
                ]
            };

        } else if (date.getDay() == 0) {
            this.json = {
                disable: [0],
                disabledDates: [
                    { year: yyyy, month: mm, day: dd},
                    { year: yyyy, month: mm, day: dd + 1 },
                ]
            };
        } else if (date.getDay() == 4) {
            this.json = {
                disable: [0],
                disabledDates: [
                    { year: yyyy, month: mm, day: dd},
                    { year: yyyy, month: mm, day: dd + 1 },
                    { year: yyyy, month: mm, day: dd + 2 },
                ]
            };
        } else {
            this.json = {
                disable: [0],
                disabledDates: [
                    { year: yyyy, month: mm, day: dd},
                    { year: yyyy, month: mm, day: dd + 2 },
                ]
            };
        }


    }

    selectInterval(event) {
        this.interval = event.target.value;
        this.close();
    }

    close() {
        this.onDatePicked.emit({ datetime: this.datetime, interval: this.interval });
        this.popover.close();
    }

    writeValue(newModel: string) {
        if (newModel) {
            this.datetime = Object.assign(this.datetime, DateTimeModel.fromLocalString(newModel));
            this.dateString = newModel;
            this.setDateStringModel();
        } else {
            this.datetime = new DateTimeModel();
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    toggleDateTimeState($event) {
        this.showTimePickerToggle = !this.showTimePickerToggle;
        $event.stopPropagation();
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInputChange($event: any) {
        const value = $event.target.value;
        const dt = DateTimeModel.fromLocalString(value);

        if (dt) {
            this.datetime = dt;
            this.setDateStringModel();
        } else if (value.trim() === '') {
            this.datetime = new DateTimeModel();
            this.dateString = '';
            this.onChange(this.dateString);
        } else {
            this.onChange(value);
        }
    }

    onDateChange($event: any | NgbDateStruct) {
        if ($event.year) {
            $event = `${$event.year}-${$event.month}-${$event.day}`
        }

        const date = DateTimeModel.fromLocalString($event);

        if (!date) {
            this.dateString = this.dateString;
            return;
        }

        if (!this.datetime) {
            this.datetime = date;
        }

        this.datetime.year = date.year;
        this.datetime.month = date.month;
        this.datetime.day = date.day;

        this.showInterval = true;

        //this.dp.navigateTo({ year: date.year, month: date.month });

        this.setDateStringModel();
        this.checkIfToday();
        this.close();
    }

    onTimeChange(event: NgbTimeStruct) {
        this.datetime.hour = event.hour;
        this.datetime.minute = event.minute;
        this.datetime.second = event.second;

        this.setDateStringModel();
    }

    setDateStringModel() {
        this.dateString = this.datetime.toString();

        if (!this.firstTimeAssign) {
            this.onChange(this.dateString);
        } else {
            // Skip very first assignment to null done by Angular
            if (this.dateString !== null) {
                this.firstTimeAssign = false;
            }
        }
    }

    inputBlur($event) {
        this.onTouched();
    }
}
