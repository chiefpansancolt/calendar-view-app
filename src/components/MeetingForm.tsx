'use client';

import { useState, useEffect } from 'react';
import type { Meeting, Category, Person } from '@/src/lib/types';
import { DAYS } from '@/src/lib/types';
import { genId } from '@/src/lib/utils';
import AttendeeMultiSelect from './AttendeeMultiSelect';

interface Props {
  categories: Category[];
  people: Person[];
  editingMeeting: Meeting | null;
  onSave: (meeting: Meeting) => void;
  onClear: () => void;
}

const BLANK = {
  title: '',
  days: [] as string[],
  cadence: '',
  category: '',
  startTime: '',
  endTime: '',
  attendees: [] as string[],
  webex: '',
  description: '',
};

export default function MeetingForm({ categories, people, editingMeeting, onSave, onClear }: Props) {
  const [fields, setFields] = useState(BLANK);
  const [error, setError] = useState('');

  // Sync form when editing meeting changes (including reset to null)
  useEffect(() => {
    if (editingMeeting) {
      setFields({
        title: editingMeeting.title,
        days: Array.isArray(editingMeeting.dayOfWeek) ? editingMeeting.dayOfWeek : [editingMeeting.dayOfWeek],
        cadence: editingMeeting.cadence,
        category: editingMeeting.category,
        startTime: editingMeeting.startTime,
        endTime: editingMeeting.endTime,
        attendees: editingMeeting.attendees || [],
        webex: editingMeeting.webexLink || '',
        description: editingMeeting.description || '',
      });
    } else {
      setFields(BLANK);
    }
    setError('');
  }, [editingMeeting]);

  function setField<K extends keyof typeof BLANK>(key: K, value: (typeof BLANK)[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDay(day: string) {
    setField(
      'days',
      fields.days.includes(day) ? fields.days.filter((d) => d !== day) : [...fields.days, day]
    );
  }

  function toggleAllDays() {
    setField('days', fields.days.length === DAYS.length ? [] : [...DAYS]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const errors: string[] = [];
    if (!fields.title.trim()) errors.push('Title is required.');
    if (fields.days.length === 0) errors.push('Select at least one day.');
    if (!fields.cadence) errors.push('Cadence is required.');
    if (!fields.startTime) errors.push('Start time is required.');
    if (!fields.endTime) errors.push('End time is required.');
    if (fields.startTime && fields.endTime && fields.startTime >= fields.endTime)
      errors.push('End time must be after start time.');
    if (!fields.category) errors.push('Category is required.');

    if (errors.length) {
      setError(errors.join(' '));
      return;
    }

    const catObj = categories.find((c) => c.name === fields.category);
    const meeting: Meeting = {
      id: editingMeeting?.id || genId(),
      title: fields.title.trim(),
      dayOfWeek: fields.days,
      startTime: fields.startTime,
      endTime: fields.endTime,
      cadence: fields.cadence as Meeting['cadence'],
      category: fields.category,
      categoryColor: catObj ? catObj.color : '#888888',
      attendees: fields.attendees,
      webexLink: fields.webex.trim(),
      description: fields.description.trim(),
    };

    onSave(meeting);
    resetForm();
  }

  function resetForm() {
    setFields(BLANK);
    setError('');
    onClear();
  }

  const inputClass =
    'w-full border border-app-border rounded-md px-2.5 py-2 text-sm outline-none focus:border-app-blue focus:shadow-[0_0_0_2px_#17A7DA22] transition-all bg-white';

  return (
    <div className="bg-white border border-app-border rounded-[10px] p-5 px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">
          {editingMeeting ? 'Edit Meeting' : 'Add Meeting'}
        </h2>
        <div className="flex items-center gap-2">
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            type="button"
            onClick={resetForm}
            className="bg-white text-app-dark border border-app-border rounded-md px-3.5 py-1.5 text-sm hover:bg-[#F0F8FB] transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            type="submit"
            form="meeting-form"
            className="bg-app-blue text-white rounded-md px-3.5 py-1.5 text-sm font-semibold hover:bg-app-navy transition-colors cursor-pointer"
          >
            Save Meeting
          </button>
        </div>
      </div>

      <form id="meeting-form" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-start">

          {/* Title */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-app-dark mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fields.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="e.g. Sprint Planning"
              maxLength={120}
              className={inputClass}
            />
          </div>

          {/* Days */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-app-dark mb-1">
              Days of Week <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {DAYS.map((day) => {
                const checked = fields.days.includes(day);
                return (
                  <label
                    key={day}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-semibold cursor-pointer transition-all select-none ${
                      checked
                        ? 'bg-app-blue border-app-blue text-white'
                        : 'bg-white border-app-border text-app-dark hover:bg-[#F0F8FB] hover:border-app-muted'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => toggleDay(day)}
                    />
                    {day.slice(0, 3)}
                  </label>
                );
              })}
              <button
                type="button"
                onClick={toggleAllDays}
                className="px-2.5 py-1.5 rounded-md border border-app-border text-xs font-semibold text-app-blue bg-white hover:bg-[#F0F8FB] hover:border-app-muted transition-colors cursor-pointer"
              >
                M–F
              </button>
            </div>
          </div>

          {/* Cadence */}
          <div>
            <label className="block text-xs font-semibold text-app-dark mb-1">
              Cadence <span className="text-red-500">*</span>
            </label>
            <select
              value={fields.cadence}
              onChange={(e) => setField('cadence', e.target.value)}
              className={inputClass}
            >
              <option value="">Select…</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="one-time">One-Time</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-app-dark mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={fields.category}
              onChange={(e) => setField('category', e.target.value)}
              className={inputClass}
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">Add a category above first.</p>
            )}
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-xs font-semibold text-app-dark mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={fields.startTime}
              onChange={(e) => setField('startTime', e.target.value)}
              className={inputClass}
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-xs font-semibold text-app-dark mb-1">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={fields.endTime}
              onChange={(e) => setField('endTime', e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Attendees */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-app-dark mb-1">Attendees</label>
            <AttendeeMultiSelect
              people={people}
              selected={fields.attendees}
              onChange={(names) => setField('attendees', names)}
            />
          </div>

          {/* Webex Link */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-app-dark mb-1">Meeting Link</label>
            <input
              type="url"
              value={fields.webex}
              onChange={(e) => setField('webex', e.target.value)}
              placeholder="https://webex.com/meet/…"
              className={inputClass}
            />
          </div>

          {/* Notes */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-app-dark mb-1">Notes</label>
            <textarea
              value={fields.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={2}
              placeholder="Optional notes…"
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
